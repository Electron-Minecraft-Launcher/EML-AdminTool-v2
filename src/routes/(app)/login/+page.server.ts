import type { Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { loginSchema } from '$lib/utils/validation'
import { login } from '$lib/server/auth'
import { BusinessError, ServerError } from '$lib/utils/errors'
import { error, fail, redirect } from '@sveltejs/kit'
import { NotificationCode } from '$lib/utils/notifications'
import { dev } from '$app/environment'
import { createSessionToken } from '$lib/server/jwt'

export const load = (async (event) => {
  if (event.locals.user) {
    throw redirect(303, '/dashboard')
  }
  return {}
}) satisfies PageServerLoad

export const actions: Actions = {
  login: async (event) => {
    const ip = event.getClientAddress()
    const form = await event.request.formData()

    const raw = {
      username: form.get('username')?.toString(),
      password: form.get('password')?.toString()
    }

    const result = loginSchema.safeParse(raw)

    if (!result.success) {
      return { failure: result.error.message }
    }

    const { username, password } = result.data

    try {
      const user = await login(username, password)
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

