export const dynamic = 'force-dynamic'
import { db } from '@/lib/db'

export default async function AdminOrdersPage() {
  const orders = await db.getOrders()
  return (
    <main className="space-y-6">
      <h1 className="text-xl font-bold">订单管理</h1>
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="card">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">{o.task_title}</div>
                <div className="text-sm text-gray-600">{o.developer_name} · 金额 ¥{o.order_amount} · 状态 {o.status}</div>
              </div>
              <div className="text-sm text-gray-600">创建时间 {new Date(o.created_at).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
