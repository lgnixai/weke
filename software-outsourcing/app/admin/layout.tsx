import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">后台管理</h1>
        <nav className="space-x-4">
          <Link href="/admin">概览</Link>
          <Link href="/admin/tasks">任务管理</Link>
          <Link href="/admin/bids">投标管理</Link>
          <Link href="/admin/developers">开发者审核</Link>
          <Link href="/admin/orders">订单管理</Link>
        </nav>
      </header>
      {children}
    </div>
  )
}
