export const dynamic = 'force-dynamic'
import { db } from '@/lib/db'
import { approveDeveloper, rejectDeveloper } from '@/app/actions'

export default async function AdminDevelopersPage() {
  const [pending, approved, rejected] = await Promise.all([
    db.getDevelopersByStatus('pending'),
    db.getDevelopersByStatus('approved'),
    db.getDevelopersByStatus('rejected'),
  ])

  async function approve(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    await approveDeveloper(id)
  }

  async function reject(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    const reason = formData.get('reason') as string
    await rejectDeveloper(id, reason)
  }

  function DevList({ items }: { items: any[] }) {
    return (
      <div className="space-y-4">
        {items.map((d) => (
          <div key={d.id} className="card">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">{d.name}</div>
                <div className="text-sm text-gray-600">{d.experience_years || 0} 年经验 · 评分 {d.rating?.toFixed?.(1) || '0.0'}</div>
              </div>
              {d.status === 'pending' && (
                <div className="flex items-center gap-2">
                  <form action={approve}>
                    <input type="hidden" name="id" value={d.id} />
                    <button className="btn-success" type="submit">通过</button>
                  </form>
                  <form action={reject} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={d.id} />
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
      <h1 className="text-xl font-bold">开发者审核</h1>
      <section>
        <h2 className="font-semibold mb-3">待审核</h2>
        <DevList items={pending} />
      </section>
      <section>
        <h2 className="font-semibold mb-3">已通过</h2>
        <DevList items={approved} />
      </section>
      <section>
        <h2 className="font-semibold mb-3">已拒绝</h2>
        <DevList items={rejected} />
      </section>
    </main>
  )
}
