'use server'

import { db } from '@/lib/db'
import { put } from '@vercel/blob'
import { revalidatePath } from 'next/cache'
import { createPaymentIntent } from '@/lib/stripe'
import {
  sendTaskApprovedEmail,
  sendTaskRejectedEmail,
  sendDeveloperApprovedEmail,
  sendDeveloperRejectedEmail,
  sendNewTaskNotification,
  sendNewDeveloperNotification,
  sendBidSelectedEmail,
} from '@/lib/email'
import { cookies } from 'next/headers'
import { signToken } from '@/lib/auth'

// Tasks
export async function getTasks(filters?: any) {
  return db.getTasks(filters)
}

export async function getTask(id: string) {
  return db.getTask(id)
}

export async function submitTask(formData: FormData) {
  try {
    const data = {
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      budgetMin: parseFloat(formData.get('budgetMin') as string),
      budgetMax: parseFloat(formData.get('budgetMax') as string),
      durationDays: parseInt(formData.get('durationDays') as string),
      description: formData.get('description') as string,
      requirements: formData.get('requirements') as string,
      skillsRequired: JSON.parse((formData.get('skillsRequired') as string) || '[]'),
      publisherName: formData.get('publisherName') as string,
      publisherPhone: formData.get('publisherPhone') as string,
      publisherEmail: formData.get('publisherEmail') as string,
      publisherWechat: formData.get('publisherWechat') as string,
    }
    const task = await db.createTask(data)
    await sendNewTaskNotification(task)
    return { success: true, taskId: task.id }
  } catch (error) {
    console.error('Submit task error:', error)
    return { success: false, error: '提交失败' }
  }
}

export async function approveTask(id: string) {
  await db.approveTask(id)
  const task = await db.getTask(id)
  await sendTaskApprovedEmail(task)
  revalidatePath('/')
  revalidatePath('/admin/tasks')
}

export async function rejectTask(id: string, reason: string) {
  await db.rejectTask(id, reason)
  const task = await db.getTask(id)
  await sendTaskRejectedEmail(task)
  revalidatePath('/admin/tasks')
}

// Bids
export async function submitBid(formData: FormData) {
  try {
    const taskId = formData.get('taskId') as string
    const developerId = formData.get('developerId') as string

    let data: any = {
      taskId,
      developerId,
      bidAmount: parseFloat(formData.get('bidAmount') as string),
      durationDays: parseInt(formData.get('durationDays') as string),
      proposal: formData.get('proposal') as string,
      technicalSolution: formData.get('technicalSolution') as string,
      portfolioLinks: JSON.parse((formData.get('portfolioLinks') as string) || '[]'),
      contactPhone: formData.get('contactPhone') as string,
      contactWechat: formData.get('contactWechat') as string,
    }

    const proposalFile = formData.get('proposalFile') as File
    if (proposalFile && proposalFile.size > 0) {
      const blob = await put(
        `proposals/${taskId}/${Date.now()}-${proposalFile.name}`,
        proposalFile,
        { access: 'public' }
      )
      data.proposalFileUrl = blob.url
    }

    await db.createBid(data)
    revalidatePath(`/tasks/${taskId}`)
    return { success: true }
  } catch (error) {
    console.error('Submit bid error:', error)
    return { success: false, error: '提交失败' }
  }
}

export async function getBidsByTask(taskId: string) {
  return db.getBidsByTask(taskId)
}

export async function selectBid(bidId: string) {
  await db.selectBid(bidId)
  const bid = await db.getBid(bidId)
  await sendBidSelectedEmail(bid)
  revalidatePath('/admin/bids')
}

// Developers
export async function submitDeveloper(formData: FormData) {
  try {
    let data: any = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      wechat: formData.get('wechat') as string,
      mainSkills: JSON.parse(formData.get('mainSkills') as string),
      skillTags: JSON.parse((formData.get('skillTags') as string) || '[]'),
      experienceYears: parseInt(formData.get('experienceYears') as string),
      currentCompany: formData.get('currentCompany') as string,
      currentPosition: formData.get('currentPosition') as string,
      selfIntroduction: formData.get('selfIntroduction') as string,
      projectExperience: formData.get('projectExperience') as string,
      techStack: formData.get('techStack') as string,
      portfolioGithub: formData.get('portfolioGithub') as string,
      portfolioWebsite: formData.get('portfolioWebsite') as string,
      portfolioOther: JSON.parse((formData.get('portfolioOther') as string) || '[]'),
      privacySettings: JSON.parse(formData.get('privacySettings') as string),
    }

    const resumeFile = formData.get('resumeFile') as File
    if (resumeFile && resumeFile.size > 0) {
      const blob = await put(`resumes/${Date.now()}-${resumeFile.name}`, resumeFile, { access: 'public' })
      data.resumeFileUrl = blob.url
    }

    const developer = await db.createDeveloper(data)
    await sendNewDeveloperNotification(developer)
    return { success: true, developerId: developer.id }
  } catch (error) {
    console.error('Submit developer error:', error)
    return { success: false, error: '提交失败' }
  }
}

export async function getPublicDevelopers(filters?: any) {
  return db.getPublicDevelopers(filters)
}

export async function approveDeveloper(id: string) {
  await db.approveDeveloper(id)
  const developer = await db.getDeveloper(id)
  await sendDeveloperApprovedEmail(developer)
  revalidatePath('/developers')
  revalidatePath('/admin/developers')
}

export async function rejectDeveloper(id: string, reason: string) {
  await db.rejectDeveloper(id, reason)
  const developer = await db.getDeveloper(id)
  await sendDeveloperRejectedEmail(developer)
  revalidatePath('/admin/developers')
}

// Orders & Payment
export async function createOrder(taskId: string, developerId: string, bidId: string, amount: number) {
  try {
    const order = await db.createOrder({ taskId, developerId, bidId, orderAmount: amount })
    const paymentResult = await createPaymentIntent(amount, order.id)
    if (paymentResult.success) {
      return { success: true, orderId: order.id, clientSecret: paymentResult.clientSecret }
    } else {
      return { success: false, error: '创建支付失败' }
    }
  } catch (error) {
    console.error('Create order error:', error)
    return { success: false, error: '创建订单失败' }
  }
}

export async function completeOrder(orderId: string) {
  await db.updateOrderStatus(orderId, 'completed')
  revalidatePath('/dashboard/my-orders')
  revalidatePath('/admin/orders')
}

// Stats
export async function getStats() {
  return db.getStats()
}

// Categories & Skills
export async function getCategories() {
  return [
    { value: 'web_development', label: '网站开发', count: 0 },
    { value: 'mobile_app', label: '移动应用', count: 0 },
    { value: 'desktop_app', label: '桌面应用', count: 0 },
    { value: 'backend_api', label: '后端API', count: 0 },
    { value: 'database', label: '数据库设计', count: 0 },
    { value: 'ai_ml', label: 'AI/机器学习', count: 0 },
    { value: 'blockchain', label: '区块链', count: 0 },
    { value: 'devops', label: 'DevOps', count: 0 },
    { value: 'other', label: '其他', count: 0 },
  ]
}

export async function getSkills() {
  return [
    { name: 'React', count: 0 },
    { name: 'Vue.js', count: 0 },
    { name: 'Angular', count: 0 },
    { name: 'Node.js', count: 0 },
    { name: 'Python', count: 0 },
    { name: 'Java', count: 0 },
    { name: 'C#', count: 0 },
    { name: 'PHP', count: 0 },
    { name: 'Go', count: 0 },
    { name: 'Rust', count: 0 },
    { name: 'Swift', count: 0 },
    { name: 'Kotlin', count: 0 },
    { name: 'Flutter', count: 0 },
    { name: 'React Native', count: 0 },
    { name: 'MySQL', count: 0 },
    { name: 'PostgreSQL', count: 0 },
    { name: 'MongoDB', count: 0 },
    { name: 'Redis', count: 0 },
    { name: 'Docker', count: 0 },
    { name: 'Kubernetes', count: 0 },
  ]
}

// Admin Auth
export async function loginAdmin(formData: FormData) {
  const password = formData.get('password') as string
  if (!process.env.ADMIN_PASSWORD) {
    return { success: false, error: '未配置后台密码' }
  }
  if (password === process.env.ADMIN_PASSWORD) {
    const token = await signToken({ role: 'admin' }, 'admin')
    cookies().set('admin_token', token, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' })
    return { success: true }
  }
  return { success: false, error: '密码错误' }
}
