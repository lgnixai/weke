import { sql } from '@vercel/postgres'

export const db = {
  async getTasks(filters?: any) {
    let query = `
      SELECT t.*, COUNT(b.id) as bid_count
      FROM tasks t
      LEFT JOIN bids b ON t.id = b.task_id
      WHERE t.status = 'approved' AND t.is_active = true
    `
    const params: any[] = []
    let i = 1

    if (filters?.category) {
      query += ` AND t.category = $${i}`
      params.push(filters.category)
      i++
    }
    if (filters?.budgetMin) {
      query += ` AND t.budget_max >= $${i}`
      params.push(filters.budgetMin)
      i++
    }
    if (filters?.budgetMax) {
      query += ` AND t.budget_min <= $${i}`
      params.push(filters.budgetMax)
      i++
    }
    if (filters?.search) {
      query += ` AND (t.title ILIKE $${i} OR t.description ILIKE $${i} OR $${i} = ANY(t.skills_required))`
      params.push(`%${filters.search}%`)
      i++
    }

    query += ` GROUP BY t.id ORDER BY t.posted_date DESC`

    const result = await sql.query(query, params)
    return result.rows
  },

  async getTask(id: string) {
    const result = await sql.query(
      `SELECT t.*, COUNT(b.id) as bid_count
       FROM tasks t
       LEFT JOIN bids b ON t.id = b.task_id
       WHERE t.id = $1
       GROUP BY t.id`,
      [id]
    )
    return result.rows[0]
  },

  async createTask(data: any) {
    const result = await sql.query(
      `INSERT INTO tasks (
        title, category, budget_min, budget_max, duration_days,
        description, requirements, skills_required,
        publisher_name, publisher_phone, publisher_email, publisher_wechat
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        data.title, data.category, data.budgetMin, data.budgetMax, data.durationDays,
        data.description, data.requirements, data.skillsRequired,
        data.publisherName, data.publisherPhone, data.publisherEmail, data.publisherWechat
      ]
    )
    return result.rows[0]
  },

  async createBid(data: any) {
    const result = await sql.query(
      `INSERT INTO bids (
        task_id, developer_id, bid_amount, duration_days,
        proposal, technical_solution, portfolio_links,
        contact_phone, contact_wechat, proposal_file_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        data.taskId, data.developerId, data.bidAmount, data.durationDays,
        data.proposal, data.technicalSolution, data.portfolioLinks,
        data.contactPhone, data.contactWechat, data.proposalFileUrl
      ]
    )
    return result.rows[0]
  },

  async getBidsByTask(taskId: string) {
    const result = await sql.query(
      `SELECT b.*, d.name as developer_name, d.main_skills, d.experience_years, d.rating
       FROM bids b
       JOIN developers d ON b.developer_id = d.id
       WHERE b.task_id = $1
       ORDER BY b.submitted_at DESC`,
      [taskId]
    )
    return result.rows
  },

  async createDeveloper(data: any) {
    const result = await sql.query(
      `INSERT INTO developers (
        name, phone, email, wechat,
        main_skills, skill_tags, experience_years,
        current_company, current_position,
        self_introduction, project_experience, tech_stack,
        portfolio_github, portfolio_website, portfolio_other,
        resume_file_url, privacy_settings
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *`,
      [
        data.name, data.phone, data.email, data.wechat,
        data.mainSkills, data.skillTags, data.experienceYears,
        data.currentCompany, data.currentPosition,
        data.selfIntroduction, data.projectExperience, data.techStack,
        data.portfolioGithub, data.portfolioWebsite, data.portfolioOther,
        data.resumeFileUrl, JSON.stringify(data.privacySettings)
      ]
    )
    return result.rows[0]
  },

  async getPublicDevelopers(filters?: any) {
    let query = `
      SELECT * FROM developers
      WHERE status = 'approved' AND is_public = true
    `
    const params: any[] = []
    let i = 1

    if (filters?.skills) {
      query += ` AND $${i} = ANY(main_skills)`
      params.push(filters.skills)
      i++
    }
    if (filters?.experienceMin) {
      query += ` AND experience_years >= $${i}`
      params.push(filters.experienceMin)
      i++
    }
    if (filters?.ratingMin) {
      query += ` AND rating >= $${i}`
      params.push(filters.ratingMin)
      i++
    }

    query += ` ORDER BY is_featured DESC, rating DESC, last_active_at DESC`

    const result = await sql.query(query, params)
    return result.rows.map(row => ({
      ...row,
      privacySettings: typeof (row as any).privacy_settings === 'string'
        ? JSON.parse((row as any).privacy_settings)
        : (row as any).privacy_settings
    }))
  },

  async createOrder(data: any) {
    const platformFeePercentage = parseFloat(process.env.PLATFORM_FEE_PERCENTAGE || '5')
    const platformFee = data.orderAmount * (platformFeePercentage / 100)
    const developerAmount = data.orderAmount - platformFee

    const result = await sql.query(
      `INSERT INTO orders (
        task_id, developer_id, bid_id,
        order_amount, platform_fee, developer_amount
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        data.taskId, data.developerId, data.bidId,
        data.orderAmount, platformFee, developerAmount
      ]
    )
    return result.rows[0]
  },

  async updateOrderStatus(id: string, status: string) {
    await sql.query(
      `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2`,
      [status, id]
    )
  },

  async getStats() {
    const tasksResult = await sql.query(`SELECT COUNT(*) as total FROM tasks WHERE status = 'approved'`)
    const developersResult = await sql.query(`SELECT COUNT(*) as total FROM developers WHERE status = 'approved'`)
    const ordersResult = await sql.query(`SELECT COUNT(*) as total FROM orders`)
    const pendingTasksResult = await sql.query(`SELECT COUNT(*) as total FROM tasks WHERE status = 'pending'`)
    const pendingDevelopersResult = await sql.query(`SELECT COUNT(*) as total FROM developers WHERE status = 'pending'`)
    const earningsResult = await sql.query(`SELECT SUM(amount) as total FROM platform_earnings`)

    return {
      totalTasks: parseInt(tasksResult.rows[0].total as any),
      totalDevelopers: parseInt(developersResult.rows[0].total as any),
      totalOrders: parseInt(ordersResult.rows[0].total as any),
      pendingTasks: parseInt(pendingTasksResult.rows[0].total as any),
      pendingDevelopers: parseInt(pendingDevelopersResult.rows[0].total as any),
      totalEarnings: parseFloat((earningsResult.rows[0].total as any) || '0'),
    }
  },

  // ================================
  // Admin: Tasks moderation
  // ================================
  async approveTask(id: string) {
    await sql.query(
      `UPDATE tasks SET status = 'approved', approved_at = NOW(), updated_at = NOW() WHERE id = $1`,
      [id]
    )
  },

  async rejectTask(id: string, reason: string) {
    await sql.query(
      `UPDATE tasks SET status = 'rejected', reject_reason = $2, updated_at = NOW() WHERE id = $1`,
      [id, reason]
    )
  },

  async getTasksByStatus(status: 'pending' | 'approved' | 'rejected') {
    const result = await sql.query(
      `SELECT t.*, COUNT(b.id) as bid_count
       FROM tasks t
       LEFT JOIN bids b ON t.id = b.task_id
       WHERE t.status = $1
       GROUP BY t.id
       ORDER BY t.created_at DESC`,
      [status]
    )
    return result.rows
  },

  // ================================
  // Admin: Bids
  // ================================
  async getBids(filters?: { status?: 'pending' | 'selected' | 'rejected'; taskId?: string; developerId?: string }) {
    let query = `
      SELECT b.*, t.title as task_title, d.name as developer_name, d.email as developer_email
      FROM bids b
      JOIN tasks t ON b.task_id = t.id
      JOIN developers d ON b.developer_id = d.id
      WHERE 1=1
    `
    const params: any[] = []
    let i = 1
    if (filters?.status) { query += ` AND b.status = $${i++}`; params.push(filters.status) }
    if (filters?.taskId) { query += ` AND b.task_id = $${i++}`; params.push(filters.taskId) }
    if (filters?.developerId) { query += ` AND b.developer_id = $${i++}`; params.push(filters.developerId) }
    query += ` ORDER BY b.submitted_at DESC`
    const res = await sql.query(query, params)
    return res.rows
  },

  async selectBid(bidId: string) {
    await sql.query(
      `WITH sel AS (
         UPDATE bids SET status = 'selected'
         WHERE id = $1
         RETURNING task_id
       )
       UPDATE bids SET status = 'rejected'
       WHERE task_id = (SELECT task_id FROM sel) AND id <> $1 AND status = 'pending'`,
      [bidId]
    )
  },

  async getBid(bidId: string) {
    const res = await sql.query(
      `SELECT b.*, t.title as task_title, d.name as developer_name, d.email as developer_email
       FROM bids b
       JOIN tasks t ON b.task_id = t.id
       JOIN developers d ON b.developer_id = d.id
       WHERE b.id = $1`,
      [bidId]
    )
    return res.rows[0]
  },

  // ================================
  // Admin: Developers moderation
  // ================================
  async approveDeveloper(id: string) {
    await sql.query(
      `UPDATE developers SET status = 'approved', approved_at = NOW(), updated_at = NOW() WHERE id = $1`,
      [id]
    )
  },

  async rejectDeveloper(id: string, reason: string) {
    await sql.query(
      `UPDATE developers SET status = 'rejected', reject_reason = $2, updated_at = NOW() WHERE id = $1`,
      [id, reason]
    )
  },

  async getDeveloper(id: string) {
    const res = await sql.query(`SELECT * FROM developers WHERE id = $1`, [id])
    return res.rows[0]
  },

  async getDevelopersByStatus(status: 'pending' | 'approved' | 'rejected') {
    const res = await sql.query(
      `SELECT * FROM developers WHERE status = $1 ORDER BY created_at DESC`,
      [status]
    )
    return res.rows
  },

  async setDeveloperPublic(id: string, isPublic: boolean) {
    await sql.query(`UPDATE developers SET is_public = $2 WHERE id = $1`, [id, isPublic])
  },

  async setDeveloperFeatured(id: string, isFeatured: boolean) {
    await sql.query(`UPDATE developers SET is_featured = $2 WHERE id = $1`, [id, isFeatured])
  },

  // ================================
  // Orders & earnings
  // ================================
  async getOrders() {
    const res = await sql.query(
      `SELECT o.*,
              t.title as task_title,
              d.name as developer_name
       FROM orders o
       JOIN tasks t ON o.task_id = t.id
       JOIN developers d ON o.developer_id = d.id
       ORDER BY o.created_at DESC`
    )
    return res.rows
  },

  async recordPlatformEarning(orderId: string) {
    await sql.query(
      `INSERT INTO platform_earnings (order_id, amount, fee_percentage)
       SELECT id,
              platform_fee,
              CASE WHEN order_amount > 0 THEN ROUND((platform_fee / order_amount) * 100, 2) ELSE 0 END
       FROM orders
       WHERE id = $1`,
      [orderId]
    )
  },
}
