import { error, fail, redirect, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { NotificationCode } from '$lib/utils/notifications'
import { registerSchema } from '$lib/utils/validations'
import { register } from '$lib/server/auth'
import { createSessionToken } from '$lib/server/jwt'
import { dev } from '$app/environment'
import { BusinessError, ServerError } from '$lib/utils/errors'
import { sleep } from '$lib/utils/utils'

export const load = (async (event) => {
  if (event.locals.user) {
    throw redirect(303, '/dashboard')
  }

  return {}
}) satisfies PageServerLoad

export const actions: Actions = {
  register: async (event) => {
    await sleep(1000) // Prevent brute-force attacks by adding a delay

    const form = await event.request.formData()

    const raw = {
      username: form.get('username'),
      password: form.get('password'),
      pin: String(form.get('pin-1') ?? '') + String(form.get('pin-2') ?? '') + String(form.get('pin-3') ?? '')
    }

    const result = registerSchema.safeParse(raw)

    if (!result.success) {
      return fail(400, { failure: JSON.parse(result.error.message)[0].message })
    }

    const { username, password, pin } = result.data

    try {
      const user = await register(username, password, pin)
      const sessionToken = await createSessionToken(user)

      event.cookies.set('session', sessionToken, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), path: '/', secure: !dev })

      return { success: true }
    } catch (err) {
      if (err instanceof BusinessError) return fail(err.httpStatus, { failure: err.code })
      if (err instanceof ServerError) throw error(err.httpStatus, { message: err.code })

      console.error('Unknown error:', err)
      throw error(500, { message: NotificationCode.INTERNAL_SERVER_ERROR })
    }
  }
}
