export const dynamic = 'force-dynamic'
import { getPublicDevelopers } from '@/app/actions'

export default async function DevelopersPage() {
  const developers = await getPublicDevelopers()

  return (
    <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {developers?.map((dev: any) => (
        <a key={dev.id} href={`/developers/${dev.id}`} className="card block">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-semibold">{dev.privacySettings?.showName ? dev.name : `${dev.name?.slice(0,1)}***`}</div>
              <div className="text-sm text-gray-600">{dev.experience_years || 0} 年经验 · 评分 {dev.rating?.toFixed?.(1) || '0.0'}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {dev.main_skills?.slice(0,6).map((s: string) => (
                  <span key={s} className="border-2 border-gray-200 rounded px-2 py-1 text-xs">{s}</span>
                ))}
              </div>
            </div>
            {dev.is_featured && <span className="status-approved">推荐</span>}
          </div>
        </a>
      ))}
    </main>
  )
}
