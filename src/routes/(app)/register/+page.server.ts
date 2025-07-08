import { error, fail, redirect, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { jwtVerify, SignJWT, type JWTPayload } from 'jose'
import { NotificationCode } from '$lib/utils/notifications'

export const load = (async (event) => {
  if (event.locals.user) {
    throw redirect(303, '/dashboard')
  }

  const secret = process.env.REGISTER_TOKEN_SECRET_KEY
  if (!secret) {
    throw error(500, 'Missing REGISTER_TOKEN_SECRET_KEY')
  }

  const payload = {
    id: crypto.randomUUID(),
    ip: event.getClientAddress(),
    createdAt: Date.now(),
    purpose: 'register' as const
  }

  const formToken = await new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('10m').sign(new TextEncoder().encode(secret))

  return { formToken }
}) satisfies PageServerLoad

export const actions: Actions = {
  register: async (event) => {
    const ip = event.getClientAddress()
    const form = await event.request.formData()

    const raw = {
      formToken: form.get('form-token')?.toString(),
      username: form.get('username')?.toString(),
      password: form.get('password')?.toString(),
      pin: (form.get('pin-1')?.toString() ?? '') + (form.get('pin-2')?.toString() ?? '') + (form.get('pin-3')?.toString() ?? '')
    }

    if (typeof raw.formToken !== 'string') {
      return fail(400, { error: NotificationCode.MISSING_INPUT })
    }

    let payload
    try {
      const { payload: verifiedPayload } = await jwtVerify(raw.formToken, new TextEncoder().encode(process.env.REGISTER_TOKEN_SECRET_KEY))

      payload = verifiedPayload as JWTPayload & {
        id: string
        ip: string
        createdAt: number
        purpose: 'register'
      }

      if (payload.purpose !== 'register') {
        return fail(400, { error: NotificationCode.INVALID_REQUEST })
      }

      if (payload.ip !== ip) {
        return fail(400, { error: NotificationCode.INVALID_REQUEST })
      }

      // (Facultatif) : Vérifie si ce token a déjà été utilisé (voir Map ou Redis)
      // const wasUsed = await tokenStore.checkIfUsed(payload.id)
      // if (wasUsed) return fail(400, { error: 'Token already used' })

      // Tu peux marquer le token comme "utilisé" ici si tu fais du suivi
      // await tokenStore.markAsUsed(payload.id)
    } catch (err) {
      console.error('Token verification failed:', err)
      return fail(400, { error:  })
    }
    // zod validation ...
  }
}

