import { loginAdmin } from '@/app/actions'

export default function AdminLoginPage() {
  async function action(formData: FormData) {
    'use server'
    await loginAdmin(formData)
  }

  return (
    <main className="max-w-md mx-auto">
      <form action={action} className="card space-y-6">
        <h1 className="text-xl font-bold">后台登录</h1>
        <div>
          <label className="block text-sm font-medium mb-1">密码</label>
          <input type="password" name="password" className="input-base" required />
        </div>
        <button className="btn-primary w-full" type="submit">登录</button>
      </form>
    </main>
  )
}
