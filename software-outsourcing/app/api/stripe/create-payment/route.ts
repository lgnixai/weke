import { NextResponse } from 'next/server'
import { createPaymentIntent } from '@/lib/stripe'

export async function POST(req: Request) {
  const { amount, orderId } = await req.json()
  if (!amount || !orderId) {
    return NextResponse.json({ success: false, error: '参数错误' }, { status: 400 })
  }
  const result = await createPaymentIntent(amount, orderId)
  return NextResponse.json(result)
}
