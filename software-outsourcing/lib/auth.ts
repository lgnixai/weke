import { SignJWT, jwtVerify } from 'jose'

const encoder = new TextEncoder()

export async function signToken(payload: Record<string, unknown>, type: 'admin' | 'user') {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET not set')
  return await new SignJWT({ ...payload, type })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encoder.encode(secret))
}

export async function verifyAuth(token: string) {
  const secret = process.env.JWT_SECRET
  if (!secret) return false
  try {
    const { payload } = await jwtVerify(token, encoder.encode(secret))
    return !!payload
  } catch {
    return false
  }
}
