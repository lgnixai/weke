import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')

  if (type === 'bids') {
    const rows = await db.getBids({})
    const header = ['id','task_title','developer_name','bid_amount','duration_days','status','submitted_at']
    const csv = [header.join(',')].concat(
      rows.map((r:any)=>[
        r.id,
        JSON.stringify(r.task_title),
        JSON.stringify(r.developer_name),
        r.bid_amount,
        r.duration_days,
        r.status,
        r.submitted_at
      ].join(','))
    ).join('\n')
    return new NextResponse(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="bids.csv"' } })
  }

  return NextResponse.json({ success: false, error: '不支持的导出类型' }, { status: 400 })
}
