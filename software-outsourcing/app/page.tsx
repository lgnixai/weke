export const dynamic = 'force-dynamic'
import { getTasks, getCategories, getSkills } from '@/app/actions'
import Link from 'next/link'

export default async function HomePage() {
  const [tasks, categories, skills] = await Promise.all([
    getTasks(),
    getCategories(),
    getSkills(),
  ])

  return (
    <main className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <aside className="md:col-span-1 space-y-6">
        <div className="card">
          <h2 className="font-semibold mb-3">任务类别</h2>
          <div className="space-y-2">
            {categories.map(c => (
              <div key={c.value} className="flex items-center justify-between">
                <span>{c.label}</span>
                <span className="text-sm text-gray-500">{c.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h2 className="font-semibold mb-3">技能标签</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map(s => (
              <span key={s.name} className="border-2 border-gray-200 rounded px-2 py-1 text-sm">{s.name}</span>
            ))}
          </div>
        </div>
      </aside>

      <section className="md:col-span-3 space-y-4">
        <div className="flex items-center gap-3">
          <input className="input-base" placeholder="搜索任务标题/描述/技能" />
          <button className="btn-secondary">搜索</button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {tasks?.map((task: any) => (
            <Link href={`/tasks/${task.id}`} key={task.id} className="card block">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <div className="text-sm text-gray-600 mt-1">预算 ¥{task.budget_min} - ¥{task.budget_max} · 周期 {task.duration_days} 天</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {task.skills_required?.map((s: string) => (
                      <span key={s} className="border-2 border-gray-200 rounded px-2 py-1 text-xs">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <div>投标数：{task.bid_count}</div>
                  <div className="mt-1">
                    <span className={
                      task.status === 'approved' ? 'status-approved' : 
                      task.status === 'pending' ? 'status-pending' : 'status-rejected'
                    }>
                      {task.status}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
