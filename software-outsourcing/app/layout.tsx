import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '软件外包平台',
  description: '连接需求方与开发者的专业平台',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-white text-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <header className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold">软件外包平台</h1>
            <nav className="space-x-4">
              <a href="/" className="underline">任务</a>
              <a href="/developers" className="underline">开发者</a>
              <a href="/post-task" className="underline">发布任务</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}
