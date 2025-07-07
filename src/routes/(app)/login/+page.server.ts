import type { Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { loginSchema } from '$lib/utils/validation'
import { login } from '$lib/server/auth'
import { BusinessError, ServerError } from '$lib/utils/errors'
import { error, fail } from '@sveltejs/kit'
import { NotificationCode } from '$lib/utils/notifications'
import { dev } from '$app/environment'

export const load = (async () => {
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
      console.log(process.env.DATABASE_URL)
      const { sessionToken, user } = await login(username, password)

      event.cookies.set('session', sessionToken, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), path: '/', secure: !dev })

      event.locals.user = {
        id: user.id,
        isAdmin: user.isAdmin
      }

      return
    } catch (err) {
      if (err instanceof BusinessError) return fail(err.httpStatus, { failure: err.code })
      if (err instanceof ServerError) throw error(err.httpStatus, { message: err.code })

      console.error('Unknown error:', err)
      throw error(500, { message: NotificationCode.INTERNAL_SERVER_ERROR })
    }
  }
}
