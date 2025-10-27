import { NextResponse } from 'next/server'
import { handleWebhook } from '@/lib/stripe'

export async function POST(req: Request) {
  const signature = req.headers.get('stripe-signature') || ''
  const payload = await req.text()
  const result = await handleWebhook(payload, signature)
  if (result.success) return NextResponse.json({ received: true })
  return new NextResponse('Webhook Error', { status: 400 })
}
