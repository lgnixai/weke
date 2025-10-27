import { getPublicDevelopers } from '@/app/actions'
import ReactMarkdown from 'react-markdown'

interface DevPageProps { params: { id: string } }

export default async function DeveloperDetailPage({ params }: DevPageProps) {
  const list = await getPublicDevelopers()
  const dev = list.find((d: any) => d.id === params.id)

  if (!dev) return <main className="max-w-3xl mx-auto">未找到开发者</main>

  return (
    <main className="max-w-3xl mx-auto space-y-6">
      <div className="card">
        <h1 className="text-xl font-bold mb-2">{dev.privacySettings?.showName ? dev.name : `${dev.name?.slice(0,1)}***`}</h1>
        <div className="text-sm text-gray-600">{dev.experience_years || 0} 年经验 · 评分 {dev.rating?.toFixed?.(1) || '0.0'}</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {dev.main_skills?.map((s: string) => (
            <span key={s} className="border-2 border-gray-200 rounded px-2 py-1 text-xs">{s}</span>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-2">个人介绍</h2>
        <div className="prose max-w-none">
          <ReactMarkdown>{dev.self_introduction}</ReactMarkdown>
        </div>
      </div>

      {dev.project_experience && (
        <div className="card">
          <h2 className="font-semibold mb-2">项目经验</h2>
          <div className="prose max-w-none">
            <ReactMarkdown>{dev.project_experience}</ReactMarkdown>
          </div>
        </div>
      )}

      {dev.tech_stack && (
        <div className="card">
          <h2 className="font-semibold mb-2">技术栈</h2>
          <div className="prose max-w-none">
            <ReactMarkdown>{dev.tech_stack}</ReactMarkdown>
          </div>
        </div>
      )}
    </main>
  )
}
