export const dynamic = 'force-dynamic'
import { getStats } from '@/app/actions'
import { Suspense } from 'react'

async function StatsCards() {
  const stats = await getStats()
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div className="card"><div className="text-sm text-gray-600">任务总数</div><div className="text-2xl font-bold">{stats.totalTasks}</div></div>
      <div className="card"><div className="text-sm text-gray-600">开发者总数</div><div className="text-2xl font-bold">{stats.totalDevelopers}</div></div>
      <div className="card"><div className="text-sm text-gray-600">总订单数</div><div className="text-2xl font-bold">{stats.totalOrders}</div></div>
      <div className="card"><div className="text-sm text-gray-600">待审核任务</div><div className="text-2xl font-bold">{stats.pendingTasks}</div></div>
      <div className="card"><div className="text-sm text-gray-600">待审核开发者</div><div className="text-2xl font-bold">{stats.pendingDevelopers}</div></div>
      <div className="card"><div className="text-sm text-gray-600">平台收入</div><div className="text-2xl font-bold">¥{stats.totalEarnings.toFixed(2)}</div></div>
    </div>
  )
}

export default function AdminHome() {
  return (
    <main className="space-y-6">
      <h2 className="text-xl font-semibold">概览</h2>
      <Suspense fallback={<div className="card">加载中...</div>}>
        <StatsCards />
      </Suspense>
    </main>
  )
}
