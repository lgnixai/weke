import { NextResponse } from 'next/server'
import { signToken } from '@/lib/auth'

export async function POST(req: Request) {
  const { type, password } = await req.json()
  if (type === 'admin') {
    if (!process.env.ADMIN_PASSWORD) return NextResponse.json({ success: false, error: '未配置后台密码' }, { status: 400 })
    if (password !== process.env.ADMIN_PASSWORD) return NextResponse.json({ success: false, error: '密码错误' }, { status: 401 })
    const token = await signToken({ role: 'admin' }, 'admin')
    const res = NextResponse.json({ success: true })
    res.cookies.set('admin_token', token, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' })
    return res
  }
  return NextResponse.json({ success: false, error: '不支持的类型' }, { status: 400 })
}
