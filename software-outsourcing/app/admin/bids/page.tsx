export const dynamic = 'force-dynamic'
import { db } from '@/lib/db'
import { selectBid } from '@/app/actions'

export default async function AdminBidsPage() {
  const bids = await db.getBids({})

  async function select(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    await selectBid(id)
  }

  return (
    <main className="space-y-6">
      <h1 className="text-xl font-bold">投标管理</h1>
      <div className="space-y-4">
        {bids.map((b) => (
          <div key={b.id} className="card">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">{b.task_title}</div>
                <div className="text-sm text-gray-600">{b.developer_name} · 报价 ¥{b.bid_amount} · 周期 {b.duration_days} 天</div>
              </div>
              <div className="flex items-center gap-2">
                {b.status === 'pending' ? (
                  <form action={select}>
                    <input type="hidden" name="id" value={b.id} />
                    <button className="btn-primary" type="submit">选中</button>
                  </form>
                ) : (
                  <span className={b.status === 'selected' ? 'status-approved' : 'status-rejected'}>{b.status}</span>
                )}
              </div>
            </div>
            {b.technical_solution && <div className="text-sm text-gray-700 mt-2 line-clamp-3">{b.technical_solution}</div>}
          </div>
        ))}
      </div>
    </main>
  )
}
