export const dynamic = 'force-dynamic'
import { approveTask, rejectTask } from '@/app/actions'
import { db } from '@/lib/db'

export default async function AdminTasksPage() {
  const [pending, approved, rejected] = await Promise.all([
    db.getTasksByStatus('pending'),
    db.getTasksByStatus('approved'),
    db.getTasksByStatus('rejected'),
  ])

  async function approve(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    await approveTask(id)
  }

  async function reject(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    const reason = formData.get('reason') as string
    await rejectTask(id, reason)
  }

  function TaskList({ items }: { items: any[] }) {
    return (
      <div className="space-y-4">
        {items.map((t) => (
          <div key={t.id} className="card">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">{t.title}</div>
                <div className="text-sm text-gray-600">预算 ¥{t.budget_min} - ¥{t.budget_max} · 周期 {t.duration_days} 天</div>
              </div>
              {t.status === 'pending' && (
                <div className="flex items-center gap-2">
                  <form action={approve}>
                    <input type="hidden" name="id" value={t.id} />
                    <button className="btn-success" type="submit">通过</button>
                  </form>
                  <form action={reject} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={t.id} />
                    <input name="reason" placeholder="拒绝原因" className="input-base" />
                    <button className="btn-danger" type="submit">拒绝</button>
                  </form>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <main className="space-y-8">
      <h1 className="text-xl font-bold">任务管理</h1>
      <section>
        <h2 className="font-semibold mb-3">待审核</h2>
        <TaskList items={pending} />
      </section>
      <section>
        <h2 className="font-semibold mb-3">已通过</h2>
        <TaskList items={approved} />
      </section>
      <section>
        <h2 className="font-semibold mb-3">已拒绝</h2>
        <TaskList items={rejected} />
      </section>
    </main>
  )
}
