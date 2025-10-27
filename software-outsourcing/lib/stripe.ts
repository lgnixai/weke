import Stripe from 'stripe'
import { db } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function createPaymentIntent(amount: number, orderId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'cny',
      metadata: { orderId },
    })
    return { success: true, clientSecret: paymentIntent.client_secret }
  } catch (error) {
    console.error('Create payment intent error:', error)
    return { success: false, error }
  }
}

export async function handleWebhook(payload: string, signature: string) {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const orderId = (paymentIntent.metadata as any).orderId
      await db.updateOrderStatus(orderId, 'paid')
      await db.recordPlatformEarning(orderId)
    }

    return { success: true }
  } catch (error) {
    console.error('Webhook error:', error)
    return { success: false, error }
  }
}
