import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAuth } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }
    const token = request.cookies.get('admin_token')?.value
    if (!token || !(await verifyAuth(token))) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('user_token')?.value
    if (!token || !(await verifyAuth(token))) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
}
