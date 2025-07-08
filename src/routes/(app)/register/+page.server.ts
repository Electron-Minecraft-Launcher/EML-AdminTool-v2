import { error, fail, redirect, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { jwtVerify, type JWTPayload } from 'jose'
import { NotificationCode } from '$lib/utils/notifications'

export const load = (async (event) => {
  if (event.locals.user) {
    throw redirect(303, '/dashboard')
  }

  return { }
}) satisfies PageServerLoad

export const actions: Actions = {
  register: async (event) => {
    const ip = event.getClientAddress()
    const form = await event.request.formData()

    const raw = {
      username: form.get('username')?.toString(),
      password: form.get('password')?.toString(),
      pin: (form.get('pin-1')?.toString() ?? '') + (form.get('pin-2')?.toString() ?? '') + (form.get('pin-3')?.toString() ?? '')
    }

    // zod validation ...
  }
}
