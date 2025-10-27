import { submitDeveloper } from '@/app/actions'

export default function RegisterDeveloperPage() {
  async function action(formData: FormData) {
    'use server'
    await submitDeveloper(formData)
  }

  return (
    <main className="max-w-2xl mx-auto">
      <form action={action} className="space-y-6 card">
        <h1 className="text-xl font-bold">开发者注册</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">姓名</label>
            <input name="name" className="input-base" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">手机</label>
            <input name="phone" pattern="\\d{11}" className="input-base" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">邮箱</label>
            <input type="email" name="email" className="input-base" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">微信（选填）</label>
            <input name="wechat" className="input-base" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">主要技能（JSON 数组）</label>
          <input name="mainSkills" placeholder='["React","Node.js"]' className="input-base" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">技能标签（JSON 数组）</label>
          <input name="skillTags" placeholder='["Frontend","Backend"]' className="input-base" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">工作年限</label>
            <input name="experienceYears" type="number" min={0} className="input-base" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">当前公司（选填）</label>
            <input name="currentCompany" className="input-base" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">当前职位（选填）</label>
          <input name="currentPosition" className="input-base" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">个人介绍（Markdown）</label>
          <textarea name="selfIntroduction" className="input-base" rows={6} required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">项目经验（Markdown，选填）</label>
          <textarea name="projectExperience" className="input-base" rows={6} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">技术栈（Markdown，选填）</label>
          <textarea name="techStack" className="input-base" rows={6} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">GitHub（选填）</label>
            <input name="portfolioGithub" className="input-base" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">作品网站（选填）</label>
            <input name="portfolioWebsite" className="input-base" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">其他作品链接（JSON 数组）</label>
          <input name="portfolioOther" placeholder='["https://..."]' className="input-base" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">隐私设置（JSON）</label>
          <textarea name="privacySettings" className="input-base" rows={4} required>{'{"showName":false,"showPhone":false,"showEmail":false,"showCurrentCompany":false,"showExperience":true,"showSkills":true,"showProjects":true}'}</textarea>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">上传简历（PDF，≤10MB）</label>
          <input type="file" name="resumeFile" accept="application/pdf" className="input-base" />
        </div>

        <div className="flex items-center gap-3">
          <button className="btn-primary" type="submit">提交认证</button>
          <a href="/developers" className="btn-secondary">返回列表</a>
        </div>
      </form>
    </main>
  )
}
