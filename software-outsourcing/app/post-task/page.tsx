import { submitTask } from '@/app/actions'

export default function PostTaskPage() {
  async function action(formData: FormData) {
    'use server'
    await submitTask(formData)
  }

  return (
    <main className="max-w-2xl mx-auto">
      <form action={action} className="space-y-6 card">
        <h1 className="text-xl font-bold">发布任务</h1>

        <div>
          <label className="block text-sm font-medium mb-1">任务标题</label>
          <input name="title" className="input-base" required maxLength={200} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">类别</label>
            <select name="category" className="input-base" required>
              <option value="web_development">网站开发</option>
              <option value="mobile_app">移动应用</option>
              <option value="backend_api">后端API</option>
              <option value="database">数据库设计</option>
              <option value="ai_ml">AI/机器学习</option>
              <option value="devops">DevOps</option>
              <option value="other">其他</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">开发周期（天）</label>
            <input name="durationDays" type="number" min={1} max={365} className="input-base" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">预算下限（¥）</label>
            <input name="budgetMin" type="number" step="0.01" className="input-base" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">预算上限（¥）</label>
            <input name="budgetMax" type="number" step="0.01" className="input-base" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">技能要求（JSON 数组）</label>
          <input name="skillsRequired" placeholder='["React","Node.js"]' className="input-base" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">需求描述（Markdown）</label>
          <textarea name="description" className="input-base" rows={6} required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">技术要求（Markdown）</label>
          <textarea name="requirements" className="input-base" rows={6} required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">联系人姓名</label>
            <input name="publisherName" className="input-base" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">手机</label>
            <input name="publisherPhone" pattern="\\d{11}" className="input-base" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">邮箱</label>
            <input name="publisherEmail" type="email" className="input-base" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">微信（选填）</label>
            <input name="publisherWechat" className="input-base" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="btn-primary" type="submit">提交审核</button>
          <a href="/" className="btn-secondary">返回首页</a>
        </div>
      </form>
    </main>
  )
}
