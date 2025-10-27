import { getTask, getBidsByTask } from '@/app/actions'
import ReactMarkdown from 'react-markdown'

interface TaskPageProps {
  params: { id: string }
}

export default async function TaskPage({ params }: TaskPageProps) {
  const task = await getTask(params.id)
  const bids = await getBidsByTask(params.id)

  return (
    <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <section className="md:col-span-2 space-y-6">
        <div className="card">
          <h1 className="text-xl font-bold mb-4">{task.title}</h1>
          <div className="text-sm text-gray-600 mb-3">预算 ¥{task.budget_min} - ¥{task.budget_max} · 周期 {task.duration_days} 天</div>

          <h2 className="font-semibold mt-6 mb-2">需求描述</h2>
          <div className="prose max-w-none">
            <ReactMarkdown>{task.description}</ReactMarkdown>
          </div>

          <h2 className="font-semibold mt-6 mb-2">技术要求</h2>
          <div className="prose max-w-none">
            <ReactMarkdown>{task.requirements}</ReactMarkdown>
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-3">投标列表</h2>
          <div className="space-y-4">
            {bids?.map((bid: any) => (
              <div key={bid.id} className="border-2 border-gray-200 rounded p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{bid.developer_name}</div>
                    <div className="text-sm text-gray-600">报价 ¥{bid.bid_amount} · 周期 {bid.duration_days} 天</div>
                  </div>
                  <div>
                    <button className="btn-primary">选择该投标</button>
                  </div>
                </div>
                {bid.technical_solution && (
                  <div className="mt-2 text-sm text-gray-700 line-clamp-3">{bid.technical_solution}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <aside className="md:col-span-1">
        <div className="card">
          <h2 className="font-semibold mb-3">提交投标</h2>
          <p className="text-sm text-gray-600 mb-3">登录认证开发者后可见</p>
          <button className="btn-secondary w-full">登录/注册</button>
        </div>
      </aside>
    </main>
  )
}
