import type { User } from '@prisma/client'
import type { RequestEvent } from '@sveltejs/kit'
import { SignJWT } from 'jose'

export async function createSessionToken(user: User): Promise<string> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET)
  return await new SignJWT({ id: user.id, isAdmin: user.isAdmin })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('365d')
    .sign(secret)
}

export function deleteSession(event: RequestEvent) {
  event.cookies.delete('session', { path: '/' })
  delete event.locals.user
}
