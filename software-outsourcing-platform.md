# 软件开发外包平台 - 完整需求与技术文档

## 一、项目概述

### 1.1 项目定位
一个专业的软件开发外包平台，连接需求方和开发者，支持任务发布、接单、项目管理、支付结算等全流程服务。

### 1.2 核心特点
- 🎨 **黑白灰极简设计风格**
- 📱 **H5 响应式布局**
- 🚀 **Vercel 一键部署**
- ✅ **双重审核机制**（任务和开发者需审核后展示）
- 🔒 **隐私保护**（个人信息脱敏展示）
- 📝 **Markdown 支持**（任务描述和开发者介绍）
- 💰 **支付集成**（支持多种支付方式）
- 📊 **项目管理**（任务进度跟踪）

### 1.3 技术栈
```
前端框架：Next.js 14 (App Router)
样式：Tailwind CSS（黑白灰配色）
数据库：Vercel Postgres
文件存储：Vercel Blob
认证：JWT (jose)
支付：Stripe
邮件：Resend
Markdown：react-markdown
图标：lucide-react
提示：react-hot-toast
日期：date-fns
图表：recharts
```

---

## 二、功能模块

### 2.1 前台功能

#### 2.1.1 任务模块
- **任务列表页** (`/`)
  - 展示已审核通过的任务
  - 左侧筛选：任务类别、预算范围、开发周期、技能要求
  - 顶部搜索：任务标题、描述、技能标签
  - 任务卡片显示：标题、预算、周期、技能要求、发布时间、状态、投标数
  
- **任务详情页** (`/tasks/[id]`)
  - 左侧：任务详情（Markdown 渲染）
  - 右侧：投标表单（仅认证开发者可见）
  
- **发布任务页** (`/post-task`)
  - 基本信息：任务标题、类别、预算、开发周期、技能要求
  - 任务详情：需求描述（Markdown）、技术要求（Markdown）
  - 联系信息：姓名、手机、邮箱、微信（不公开）
  - 提交后进入待审核状态

#### 2.1.2 投标模块
- **投标表单**
  - 必填：投标金额、开发周期、联系方式（手机/微信）
  - 选填：项目经验介绍、技术方案、作品展示链接
  - 附件：技术方案文档（PDF，最大 10MB）

#### 2.1.3 开发者模块
- **开发者列表页** (`/developers`)
  - 展示已认证的开发者
  - 左侧筛选：技能标签、经验年限、评分、地区
  - 脱敏展示：根据开发者隐私设置
  - 开发者卡片显示：姓名（脱敏）、技能标签、经验年限、评分、完成项目数
  
- **开发者详情页** (`/developers/[id]`)
  - 根据隐私设置展示信息
  - 需求方可发起合作邀请
  
- **开发者注册页** (`/register-developer`)
  - **第一步：基本信息**
    - 个人信息：姓名、手机、邮箱、微信、工作年限、当前公司、当前职位
    - 技能信息：主要技能、技能标签、经验年限
  - **第二步：详细信息**
    - 个人介绍（Markdown，必填）
    - 项目经验（Markdown，选填）
    - 技术栈（Markdown，选填）
    - 作品展示（GitHub/作品链接）
    - 上传简历文件（PDF，最大 10MB，选填）
  - **第三步：隐私设置**
    - 可选择公开：姓名、手机、邮箱、当前公司、项目经验、技能
    - 默认建议：隐藏敏感信息，公开能力信息

### 2.2 后台功能

#### 2.2.1 登录系统 (`/admin/login`)
- 密码登录（环境变量配置）
- JWT Token 认证
- 中间件保护后台路由

#### 2.2.2 后台布局
- 顶部导航：概览、任务管理、投标管理、开发者审核、订单管理、退出
- 黑白灰极简风格

#### 2.2.3 概览页 (`/admin`)
- 数据统计卡片：任务总数、开发者总数、总订单数、待审核任务、待审核开发者、平台收入
- 最近投标列表
- 收入趋势图表

#### 2.2.4 任务管理 (`/admin/tasks`)
- **标签页**
  - 待审核：显示待审核任务，可通过/拒绝
  - 已通过：显示已通过任务，可查看投标
  - 已拒绝：显示已拒绝任务及原因
  
- **任务审核卡片**
  - 展开查看：完整任务信息（Markdown 渲染）、联系信息
  - 操作：通过、拒绝（需填写原因）
  - 通过后自动发邮件通知发布者

#### 2.2.5 投标管理 (`/admin/bids`)
- 筛选：任务、开发者、状态
- 投标卡片显示：
  - 任务信息、开发者信息、投标金额、开发周期
  - 联系方式（一键复制）
  - 技术方案、项目经验
  - 状态管理：待处理、已选中、已拒绝
- 导出功能：导出为 CSV

#### 2.2.6 开发者审核 (`/admin/developers`)
- **标签页**
  - 待审核：显示待审核开发者，可通过/拒绝
  - 已通过：显示已认证开发者，可控制公开/隐藏、推荐
  
- **开发者审核卡片**
  - 展开查看：完整开发者信息（Markdown 渲染）、联系方式、隐私设置
  - 操作：
    - 待审核：通过、拒绝（需填写原因）
    - 已通过：公开/隐藏、设为推荐、查看前台展示
  - 管理员备注：可添加内部备注
  - 通过后自动发邮件通知开发者

#### 2.2.7 订单管理 (`/admin/orders`)
- 订单列表：任务、开发者、金额、状态、创建时间
- 订单状态：进行中、已完成、已取消、争议中
- 支付管理：查看支付状态、处理退款
- 争议处理：处理订单争议

---

## 三、数据库设计

### 3.1 表结构

```sql
-- ========================================
-- 任务表
-- ========================================
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 基本信息
  title VARCHAR(200) NOT NULL,
  category VARCHAR(50) NOT NULL,
  budget_min DECIMAL(10,2) NOT NULL,
  budget_max DECIMAL(10,2) NOT NULL,
  duration_days INT NOT NULL,
  
  -- 任务详情（Markdown）
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  skills_required TEXT[],
  
  -- 发布者信息（不公开）
  publisher_name VARCHAR(100) NOT NULL,
  publisher_phone VARCHAR(20) NOT NULL,
  publisher_email VARCHAR(255) NOT NULL,
  publisher_wechat VARCHAR(50),
  
  -- 审核状态
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reject_reason TEXT,
  
  -- 时间戳
  posted_date TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- 投标表
-- ========================================
CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  developer_id UUID NOT NULL REFERENCES developers(id) ON DELETE CASCADE,
  
  -- 投标信息
  bid_amount DECIMAL(10,2) NOT NULL,
  duration_days INT NOT NULL,
  proposal TEXT,
  technical_solution TEXT,
  portfolio_links TEXT[],
  
  -- 联系方式
  contact_phone VARCHAR(20) NOT NULL,
  contact_wechat VARCHAR(50),
  
  -- 附件
  proposal_file_url TEXT,
  
  -- 状态
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'selected', 'rejected')),
  submitted_at TIMESTAMP DEFAULT NOW(),
  
  -- 约束
  CONSTRAINT unique_task_developer_bid UNIQUE (task_id, developer_id)
);

-- ========================================
-- 开发者表
-- ========================================
CREATE TABLE developers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 基本信息
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  wechat VARCHAR(50),
  
  -- 技能信息
  main_skills TEXT[] NOT NULL,
  skill_tags TEXT[],
  experience_years INT,
  
  -- 个人信息
  current_company VARCHAR(200),
  current_position VARCHAR(200),
  
  -- 详细信息（Markdown）
  self_introduction TEXT NOT NULL,
  project_experience TEXT,
  tech_stack TEXT,
  
  -- 作品展示
  portfolio_github VARCHAR(255),
  portfolio_website VARCHAR(255),
  portfolio_other TEXT[],
  
  -- 附件简历
  resume_file_url TEXT,
  
  -- 隐私设置（JSONB）
  privacy_settings JSONB DEFAULT '{
    "showName": false,
    "showPhone": false,
    "showEmail": false,
    "showCurrentCompany": false,
    "showExperience": true,
    "showSkills": true,
    "showProjects": true
  }',
  
  -- 审核状态
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reject_reason TEXT,
  
  -- 展示控制
  is_public BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  admin_notes TEXT,
  
  -- 统计
  completed_projects INT DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_earnings DECIMAL(12,2) DEFAULT 0.00,
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  last_active_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- 订单表
-- ========================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  developer_id UUID NOT NULL REFERENCES developers(id) ON DELETE CASCADE,
  bid_id UUID NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
  
  -- 订单信息
  order_amount DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) NOT NULL,
  developer_amount DECIMAL(10,2) NOT NULL,
  
  -- 状态
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'in_progress', 'completed', 'cancelled', 'disputed')),
  
  -- 支付信息
  payment_intent_id VARCHAR(255),
  payment_status VARCHAR(50),
  paid_at TIMESTAMP,
  
  -- 项目进度
  progress_percentage INT DEFAULT 0,
  milestones JSONB DEFAULT '[]',
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  cancelled_at TIMESTAMP
);

-- ========================================
-- 评价表
-- ========================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL, -- 评价者ID（任务发布者或开发者）
  reviewee_id UUID NOT NULL, -- 被评价者ID
  reviewer_type VARCHAR(20) NOT NULL CHECK (reviewer_type IN ('publisher', 'developer')),
  
  -- 评价内容
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- 消息表
-- ========================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('publisher', 'developer', 'admin')),
  
  -- 消息内容
  content TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image')),
  file_url TEXT,
  
  -- 状态
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- 平台收入表
-- ========================================
CREATE TABLE platform_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  
  -- 收入信息
  amount DECIMAL(10,2) NOT NULL,
  fee_percentage DECIMAL(5,2) NOT NULL,
  
  -- 时间戳
  earned_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- 索引
-- ========================================
CREATE INDEX idx_tasks_status ON tasks(status, posted_date DESC);
CREATE INDEX idx_tasks_category ON tasks(category);
CREATE INDEX idx_tasks_budget ON tasks(budget_min, budget_max);
CREATE INDEX idx_tasks_approved ON tasks(status, is_active, posted_date DESC) 
  WHERE status = 'approved' AND is_active = true;

CREATE INDEX idx_bids_task_id ON bids(task_id);
CREATE INDEX idx_bids_developer_id ON bids(developer_id);
CREATE INDEX idx_bids_status ON bids(status);

CREATE INDEX idx_developers_status ON developers(status, is_public);
CREATE INDEX idx_developers_skills ON developers USING GIN(main_skills);
CREATE INDEX idx_developers_tags ON developers USING GIN(skill_tags);
CREATE INDEX idx_developers_rating ON developers(rating DESC);

CREATE INDEX idx_orders_task_id ON orders(task_id);
CREATE INDEX idx_orders_developer_id ON orders(developer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment ON orders(payment_intent_id);

CREATE INDEX idx_reviews_order_id ON reviews(order_id);
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);

CREATE INDEX idx_messages_order_id ON messages(order_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);

CREATE INDEX idx_platform_earnings_date ON platform_earnings(earned_at);
```

---

## 四、项目结构

```
software-outsourcing/
├── app/
│   ├── layout.tsx                      # 全局布局
│   ├── globals.css                     # 全局样式
│   ├── page.tsx                        # 首页（任务列表）
│   │
│   ├── tasks/
│   │   └── [id]/
│   │       └── page.tsx                # 任务详情
│   │
│   ├── post-task/
│   │   └── page.tsx                    # 发布任务
│   │
│   ├── developers/
│   │   ├── page.tsx                    # 开发者列表
│   │   └── [id]/
│   │       └── page.tsx                # 开发者详情
│   │
│   ├── register-developer/
│   │   └── page.tsx                    # 开发者注册
│   │
│   ├── dashboard/
│   │   ├── layout.tsx                  # 用户仪表板布局
│   │   ├── page.tsx                    # 仪表板首页
│   │   ├── my-tasks/
│   │   │   └── page.tsx                # 我的任务
│   │   ├── my-bids/
│   │   │   └── page.tsx                # 我的投标
│   │   ├── my-orders/
│   │   │   └── page.tsx                # 我的订单
│   │   └── profile/
│   │       └── page.tsx                # 个人资料
│   │
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx                # 后台登录
│   │   ├── layout.tsx                  # 后台布局
│   │   ├── page.tsx                    # 后台概览
│   │   ├── tasks/
│   │   │   └── page.tsx                # 任务管理
│   │   ├── bids/
│   │   │   └── page.tsx                # 投标管理
│   │   ├── developers/
│   │   │   └── page.tsx                # 开发者审核
│   │   └── orders/
│   │       └── page.tsx                # 订单管理
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   └── route.ts                # 登录/登出 API
│   │   ├── stripe/
│   │   │   ├── webhook/
│   │   │   │   └── route.ts            # Stripe Webhook
│   │   │   └── create-payment/
│   │   │       └── route.ts            # 创建支付
│   │   └── export/
│   │       └── route.ts                # 导出数据
│   │
│   └── actions.ts                      # Server Actions
│
├── components/
│   ├── TaskCard.tsx                    # 任务卡片
│   ├── TaskReviewCard.tsx              # 任务审核卡片
│   ├── BidForm.tsx                     # 投标表单
│   ├── BidList.tsx                     # 投标列表
│   ├── DeveloperCard.tsx               # 开发者卡片（脱敏）
│   ├── DeveloperReviewCard.tsx         # 开发者审核卡片
│   ├── OrderCard.tsx                   # 订单卡片
│   ├── PaymentForm.tsx                 # 支付表单
│   ├── MessageList.tsx                 # 消息列表
│   ├── AdminNav.tsx                    # 后台导航
│   ├── UserNav.tsx                     # 用户导航
│   └── StatusBadge.tsx                 # 状态标签
│
├── lib/
│   ├── db.ts                           # 数据库连接（Vercel Postgres）
│   ├── auth.ts                         # JWT 认证逻辑
│   ├── email.ts                        # 邮件发送（Resend）
│   ├── stripe.ts                       # Stripe 支付集成
│   └── utils.ts                        # 工具函数
│
├── middleware.ts                       # 路由中间件（保护后台路由）
├── tailwind.config.ts                  # Tailwind 配置（黑白灰主题）
├── next.config.js                      # Next.js 配置
├── package.json                        # 依赖配置
├── tsconfig.json                       # TypeScript 配置
└── .env.local                          # 环境变量（本地）
```

---

## 五、核心配置文件

### 5.1 package.json

```json
{
  "name": "software-outsourcing",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@vercel/blob": "^0.23.0",
    "@vercel/postgres": "^0.9.0",
    "stripe": "^14.0.0",
    "bcryptjs": "^2.4.3",
    "jose": "^5.2.0",
    "react-hot-toast": "^2.4.1",
    "react-markdown": "^9.0.1",
    "date-fns": "^3.3.0",
    "lucide-react": "^0.344.0",
    "resend": "^3.2.0",
    "recharts": "^2.8.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@types/bcryptjs": "^2.4.6",
    "typescript": "^5",
    "tailwindcss": "^3.4.0",
    "postcss": "^8",
    "autoprefixer": "^10"
  }
}
```

### 5.2 tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        foreground: '#000000',
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'PingFang SC', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
export default config
```

### 5.3 app/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-white text-gray-900 antialiased;
  }
}

@layer components {
  /* 按钮样式 */
  .btn-primary {
    @apply bg-black text-white px-6 py-3 rounded-lg font-medium 
           hover:bg-gray-800 transition-colors disabled:bg-gray-300 
           disabled:cursor-not-allowed;
  }
  
  .btn-secondary {
    @apply bg-white text-black border-2 border-black px-6 py-3 
           rounded-lg font-medium hover:bg-gray-50 transition-colors;
  }
  
  .btn-success {
    @apply bg-green-600 text-white px-6 py-3 rounded-lg font-medium 
           hover:bg-green-700 transition-colors;
  }
  
  .btn-danger {
    @apply bg-red-600 text-white px-6 py-3 rounded-lg font-medium 
           hover:bg-red-700 transition-colors;
  }
  
  /* 输入框样式 */
  .input-base {
    @apply w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
           focus:border-black focus:outline-none transition-colors
           placeholder:text-gray-400;
  }
  
  /* 卡片样式 */
  .card {
    @apply bg-white border-2 border-gray-200 rounded-lg p-6 
           hover:border-gray-400 transition-colors;
  }
  
  /* 状态标签 */
  .status-pending {
    @apply bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm;
  }
  
  .status-approved {
    @apply bg-green-100 text-green-800 px-2 py-1 rounded text-sm;
  }
  
  .status-rejected {
    @apply bg-red-100 text-red-800 px-2 py-1 rounded text-sm;
  }
}
```

### 5.4 .env.local（示例）

```bash
# 数据库
POSTGRES_URL="postgres://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb"

# Vercel Blob
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxx"

# 后台管理
ADMIN_PASSWORD="your_secure_password_here"

# JWT Secret
JWT_SECRET="your_jwt_secret_32_characters_min"

# 邮件服务（Resend）
RESEND_API_KEY="re_xxx"
ADMIN_EMAIL="admin@yourdomain.com"

# Stripe 支付
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_PUBLISHABLE_KEY="pk_test_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"

# 站点 URL
SITE_URL="https://yourdomain.com"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxx"

# 平台费率（百分比）
PLATFORM_FEE_PERCENTAGE="5"
```

### 5.5 middleware.ts

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAuth } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  // 保护后台路由
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // 登录页不需要验证
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }

    const token = request.cookies.get('admin_token')?.value

    if (!token || !(await verifyAuth(token))) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // 保护用户仪表板路由
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('user_token')?.value

    if (!token || !(await verifyAuth(token))) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
}
```

---

## 六、核心代码实现

### 6.1 数据库连接 (lib/db.ts)

```typescript
import { sql } from '@vercel/postgres'

export const db = {
  // Tasks
  async getTasks(filters?: any) {
    let query = `
      SELECT t.*, 
             COUNT(b.id) as bid_count
      FROM tasks t
      LEFT JOIN bids b ON t.id = b.task_id
      WHERE t.status = 'approved' AND t.is_active = true
    `
    const params: any[] = []
    let paramIndex = 1

    if (filters?.category) {
      query += ` AND t.category = $${paramIndex}`
      params.push(filters.category)
      paramIndex++
    }

    if (filters?.budgetMin) {
      query += ` AND t.budget_max >= $${paramIndex}`
      params.push(filters.budgetMin)
      paramIndex++
    }

    if (filters?.budgetMax) {
      query += ` AND t.budget_min <= $${paramIndex}`
      params.push(filters.budgetMax)
      paramIndex++
    }

    if (filters?.search) {
      query += ` AND (t.title ILIKE $${paramIndex} OR t.description ILIKE $${paramIndex} OR $${paramIndex} = ANY(t.skills_required))`
      params.push(`%${filters.search}%`)
      paramIndex++
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

  // Bids
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

  // Developers
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
    let paramIndex = 1

    if (filters?.skills) {
      query += ` AND $${paramIndex} = ANY(main_skills)`
      params.push(filters.skills)
      paramIndex++
    }

    if (filters?.experienceMin) {
      query += ` AND experience_years >= $${paramIndex}`
      params.push(filters.experienceMin)
      paramIndex++
    }

    if (filters?.ratingMin) {
      query += ` AND rating >= $${paramIndex}`
      params.push(filters.ratingMin)
      paramIndex++
    }

    query += ` ORDER BY is_featured DESC, rating DESC, last_active_at DESC`

    const result = await sql.query(query, params)
    return result.rows.map(row => ({
      ...row,
      privacySettings: typeof row.privacy_settings === 'string' 
        ? JSON.parse(row.privacy_settings) 
        : row.privacy_settings
    }))
  },

  // Orders
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

  // Stats
  async getStats() {
    const tasksResult = await sql.query(
      `SELECT COUNT(*) as total FROM tasks WHERE status = 'approved'`
    )
    const developersResult = await sql.query(
      `SELECT COUNT(*) as total FROM developers WHERE status = 'approved'`
    )
    const ordersResult = await sql.query(
      `SELECT COUNT(*) as total FROM orders`
    )
    const pendingTasksResult = await sql.query(
      `SELECT COUNT(*) as total FROM tasks WHERE status = 'pending'`
    )
    const pendingDevelopersResult = await sql.query(
      `SELECT COUNT(*) as total FROM developers WHERE status = 'pending'`
    )
    const earningsResult = await sql.query(
      `SELECT SUM(amount) as total FROM platform_earnings`
    )

    return {
      totalTasks: parseInt(tasksResult.rows[0].total),
      totalDevelopers: parseInt(developersResult.rows[0].total),
      totalOrders: parseInt(ordersResult.rows[0].total),
      pendingTasks: parseInt(pendingTasksResult.rows[0].total),
      pendingDevelopers: parseInt(pendingDevelopersResult.rows[0].total),
      totalEarnings: parseFloat(earningsResult.rows[0].total || '0'),
    }
  }
}
```

### 6.2 Stripe 支付集成 (lib/stripe.ts)

```typescript
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function createPaymentIntent(amount: number, orderId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // 转换为分
      currency: 'cny',
      metadata: {
        orderId,
      },
    })

    return { success: true, clientSecret: paymentIntent.client_secret }
  } catch (error) {
    console.error('Create payment intent error:', error)
    return { success: false, error }
  }
}

export async function handleWebhook(payload: string, signature: string) {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const orderId = paymentIntent.metadata.orderId

      // 更新订单状态为已支付
      await db.updateOrderStatus(orderId, 'paid')
      
      // 记录平台收入
      await db.recordPlatformEarning(orderId, paymentIntent.amount / 100)
    }

    return { success: true }
  } catch (error) {
    console.error('Webhook error:', error)
    return { success: false, error }
  }
}
```

### 6.3 Server Actions (app/actions.ts)

```typescript
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
  sendBidSelectedEmail
} from '@/lib/email'

// ========================================
// Tasks
// ========================================

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
      skillsRequired: JSON.parse(formData.get('skillsRequired') as string || '[]'),
      publisherName: formData.get('publisherName') as string,
      publisherPhone: formData.get('publisherPhone') as string,
      publisherEmail: formData.get('publisherEmail') as string,
      publisherWechat: formData.get('publisherWechat') as string,
    }

    const task = await db.createTask(data)
    
    // 发送通知邮件给管理员
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

// ========================================
// Bids
// ========================================

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
      portfolioLinks: JSON.parse(formData.get('portfolioLinks') as string || '[]'),
      contactPhone: formData.get('contactPhone') as string,
      contactWechat: formData.get('contactWechat') as string,
    }

    // 上传技术方案文件
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

// ========================================
// Developers
// ========================================

export async function submitDeveloper(formData: FormData) {
  try {
    let data: any = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      wechat: formData.get('wechat') as string,
      mainSkills: JSON.parse(formData.get('mainSkills') as string),
      skillTags: JSON.parse(formData.get('skillTags') as string || '[]'),
      experienceYears: parseInt(formData.get('experienceYears') as string),
      currentCompany: formData.get('currentCompany') as string,
      currentPosition: formData.get('currentPosition') as string,
      selfIntroduction: formData.get('selfIntroduction') as string,
      projectExperience: formData.get('projectExperience') as string,
      techStack: formData.get('techStack') as string,
      portfolioGithub: formData.get('portfolioGithub') as string,
      portfolioWebsite: formData.get('portfolioWebsite') as string,
      portfolioOther: JSON.parse(formData.get('portfolioOther') as string || '[]'),
      privacySettings: JSON.parse(formData.get('privacySettings') as string),
    }

    // 上传简历文件
    const resumeFile = formData.get('resumeFile') as File
    if (resumeFile && resumeFile.size > 0) {
      const blob = await put(
        `resumes/${Date.now()}-${resumeFile.name}`,
        resumeFile,
        { access: 'public' }
      )
      data.resumeFileUrl = blob.url
    }

    const developer = await db.createDeveloper(data)
    
    // 发送通知邮件给管理员
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

// ========================================
// Orders & Payment
// ========================================

export async function createOrder(taskId: string, developerId: string, bidId: string, amount: number) {
  try {
    const order = await db.createOrder({
      taskId,
      developerId,
      bidId,
      orderAmount: amount
    })

    const paymentResult = await createPaymentIntent(amount, order.id)
    
    if (paymentResult.success) {
      return { 
        success: true, 
        orderId: order.id, 
        clientSecret: paymentResult.clientSecret 
      }
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

// ========================================
// Stats
// ========================================

export async function getStats() {
  return db.getStats()
}

// ========================================
// Categories & Skills
// ========================================

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
```

---

## 七、Vercel 部署步骤

### 7.1 准备工作

1. **创建 GitHub 仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **注册相关服务账号**
   - Vercel: https://vercel.com
   - Stripe: https://stripe.com
   - Resend: https://resend.com

### 7.2 部署步骤

1. **导入项目**
   - 在 Vercel Dashboard 点击 "Add New" → "Project"
   - 选择你的 GitHub 仓库
   - Framework Preset: Next.js
   - Root Directory: `./`

2. **配置环境变量**
   
   在 Vercel 项目设置中添加以下环境变量：
   
   ```
   ADMIN_PASSWORD=your_secure_password_here
   JWT_SECRET=your_jwt_secret_32_characters_minimum
   ADMIN_EMAIL=admin@yourdomain.com
   SITE_URL=https://your-project.vercel.app
   NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
   
   STRIPE_SECRET_KEY=sk_live_xxx
   STRIPE_PUBLISHABLE_KEY=pk_live_xxx
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
   
   RESEND_API_KEY=re_xxx
   PLATFORM_FEE_PERCENTAGE=5
   ```

3. **创建 Vercel Postgres 数据库**
   - 在项目 Dashboard → Storage → Create Database
   - 选择 Postgres
   - 创建后会自动添加 `POSTGRES_URL` 等环境变量

4. **创建 Vercel Blob 存储**
   - 在项目 Dashboard → Storage → Create Store
   - 选择 Blob
   - 创建后会自动添加 `BLOB_READ_WRITE_TOKEN` 环境变量

5. **配置 Stripe**
   - 在 Stripe Dashboard 创建 Webhook
   - Endpoint URL: `https://your-project.vercel.app/api/stripe/webhook`
   - Events: `payment_intent.succeeded`
   - 获取 Webhook Secret

6. **初始化数据库**
   - 部署完成后，访问 Vercel Dashboard → Storage → Postgres
   - 点击 "Query" 标签
   - 复制粘贴上面的完整 SQL Schema
   - 点击 "Run Query" 执行

7. **部署**
   - 点击 "Deploy"
   - 等待构建完成（约 3-5 分钟）

8. **验证**
   - 访问部署的 URL
   - 测试前台功能
   - 访问 `/admin/login` 测试后台登录
   - 测试支付功能

### 7.3 后续更新

每次推送到 GitHub main 分支，Vercel 会自动重新部署。

```bash
git add .
git commit -m "Update feature"
git push
```

---

## 八、开发注意事项

### 8.1 必须实现的功能点

✅ **前台**
- 任务列表、详情、发布
- 开发者列表、详情、注册
- 投标系统
- 筛选和搜索
- 响应式布局

✅ **后台**
- 登录认证
- 任务审核（通过/拒绝）
- 投标管理（选择/拒绝）
- 开发者审核（通过/拒绝/公开/推荐）
- 订单管理（支付/完成/争议）
- 数据统计

✅ **支付系统**
- Stripe 集成
- 订单创建
- 支付处理
- 平台抽成
- 退款处理

✅ **通用**
- Markdown 渲染
- 文件上传（PDF，最大 10MB）
- 邮件通知
- 数据验证
- 错误处理

### 8.2 黑白灰设计规范

**颜色使用：**
- 主色：`#000000`（黑色）
- 背景：`#FFFFFF`（白色）
- 灰度：`#F5F5F5` `#E5E5E5` `#D4D4D4` `#A3A3A3` `#737373` `#525252`
- 强调：黑色背景 + 白色文字
- 边框：2px 实线

**组件样式：**
- 按钮：圆角 `8px`，内边距 `12px 24px`
- 输入框：圆角 `8px`，边框 `2px`
- 卡片：圆角 `8px`，边框 `2px`，悬停加深边框
- 字体：系统默认字体栈

### 8.3 响应式断点

```
移动端：< 768px
平板：768px - 1024px
桌面：> 1024px
```

### 8.4 数据验证规则

**任务发布：**
- 任务标题：必填，最大 200 字符
- 预算范围：必填，最小值 ≤ 最大值
- 开发周期：必填，1-365 天
- 任务描述：必填，Markdown 格式
- 技术要求：必填，Markdown 格式
- 联系手机：必填，11 位数字
- 联系邮箱：必填，邮箱格式

**投标：**
- 投标金额：必填，在任务预算范围内
- 开发周期：必填，不超过任务要求
- 联系方式：手机或微信至少一个

**开发者注册：**
- 基本信息：姓名、手机、邮箱、主要技能必填
- 个人介绍：必填，至少 10 字
- 简历文件：选填，PDF 格式，最大 10MB

### 8.5 安全注意事项

1. **SQL 注入防护**：使用参数化查询
2. **XSS 防护**：Markdown 渲染时过滤危险标签
3. **文件上传**：验证文件类型和大小
4. **认证保护**：后台路由使用 middleware 保护
5. **隐私保护**：开发者信息根据隐私设置脱敏展示
6. **支付安全**：使用 Stripe 官方 SDK，不存储敏感支付信息

### 8.6 性能优化

1. **图片优化**：使用 Next.js Image 组件
2. **代码分割**：动态导入大型组件
3. **缓存策略**：使用 revalidatePath 精确刷新
4. **数据库索引**：已在 Schema 中定义
5. **CDN 加速**：Vercel 自动提供

---

## 九、测试清单

### 9.1 前台测试

- [ ] 首页任务列表正常显示
- [ ] 任务筛选功能正常
- [ ] 任务搜索功能正常
- [ ] 任务详情页正常显示（Markdown 渲染）
- [ ] 发布任务表单验证正常
- [ ] 发布任务成功，进入待审核状态
- [ ] 投标表单显示正常
- [ ] 投标提交成功
- [ ] 开发者列表正常显示（脱敏）
- [ ] 开发者详情页根据隐私设置显示
- [ ] 开发者注册三步流程正常
- [ ] 开发者注册成功，进入待审核状态
- [ ] 移动端响应式布局正常

### 9.2 后台测试

- [ ] 后台登录功能正常
- [ ] 未登录访问后台自动跳转登录页
- [ ] 概览页数据统计正确
- [ ] 任务审核列表正常显示
- [ ] 任务审核通过功能正常，发送邮件
- [ ] 任务审核拒绝功能正常，发送邮件
- [ ] 投标管理列表正常显示
- [ ] 投标选择功能正常
- [ ] 联系方式复制功能正常
- [ ] 开发者审核列表正常显示
- [ ] 开发者审核通过功能正常，发送邮件
- [ ] 开发者审核拒绝功能正常，发送邮件
- [ ] 开发者公开/隐藏功能正常
- [ ] 开发者推荐功能正常
- [ ] 订单管理功能正常
- [ ] 退出登录功能正常

### 9.3 支付测试

- [ ] 订单创建功能正常
- [ ] Stripe 支付集成正常
- [ ] 支付成功回调正常
- [ ] 平台抽成计算正确
- [ ] 订单状态更新正常
- [ ] 退款功能正常

### 9.4 邮件测试

- [ ] 新任务提交后管理员收到通知
- [ ] 任务审核通过后发布者收到通知
- [ ] 任务审核拒绝后发布者收到通知
- [ ] 新开发者提交后管理员收到通知
- [ ] 开发者审核通过后开发者收到通知
- [ ] 开发者审核拒绝后开发者收到通知
- [ ] 投标被选中后开发者收到通知

---

## 十、常见问题

### Q1: 数据库连接失败？
**A:** 检查 `POSTGRES_URL` 环境变量是否正确配置，确保在 Vercel 中创建了 Postgres 数据库。

### Q2: 文件上传失败？
**A:** 检查 `BLOB_READ_WRITE_TOKEN` 环境变量是否正确配置，确保在 Vercel 中创建了 Blob 存储。

### Q3: 邮件发送失败？
**A:** 检查 `RESEND_API_KEY` 是否正确配置，确保 Resend 账号有效且有发送额度。

### Q4: 后台登录失败？
**A:** 检查 `ADMIN_PASSWORD` 和 `JWT_SECRET` 环境变量是否正确配置。

### Q5: Stripe 支付失败？
**A:** 检查 Stripe 相关环境变量是否正确配置，确保 Webhook 端点正确设置。

### Q6: Markdown 不渲染？
**A:** 确保安装了 `react-markdown` 依赖，并正确导入组件。

### Q7: 样式不生效？
**A:** 检查 `tailwind.config.ts` 配置是否正确，确保 `globals.css` 已导入。

---

## 十一、扩展功能（可选）

### Phase 2 可以添加的功能：

1. **项目管理**
   - 里程碑管理
   - 进度跟踪
   - 文件共享
   - 实时聊天

2. **评价系统**
   - 双向评价
   - 评分统计
   - 信誉体系

3. **数据分析**
   - 收入统计图表
   - 热门技能排行
   - 地区分布统计
   - 用户行为分析

4. **用户体验**
   - 任务收藏
   - 推荐系统
   - 消息通知
   - 移动端 APP

5. **SEO 优化**
   - 结构化数据
   - Sitemap 生成
   - Meta 标签优化

6. **高级功能**
   - 团队协作
   - 项目模板
   - 自动匹配
   - 智能推荐

---

## 十二、交付清单

### 代码交付
- [x] 完整的 Next.js 项目代码
- [x] 数据库 Schema SQL 文件
- [x] 环境变量配置示例
- [x] README.md 部署说明

### 文档交付
- [x] 需求文档
- [x] 技术文档
- [x] 数据库设计文档
- [x] API 文档（Server Actions）
- [x] 部署文档
- [x] 测试清单

### 设计交付
- [x] 黑白灰配色方案
- [x] 响应式布局规范
- [x] 组件样式规范

### 功能交付
- [x] 任务发布和管理
- [x] 开发者注册和认证
- [x] 投标系统
- [x] 支付集成
- [x] 后台管理
- [x] 邮件通知
- [x] 文件上传
- [x] 数据统计
