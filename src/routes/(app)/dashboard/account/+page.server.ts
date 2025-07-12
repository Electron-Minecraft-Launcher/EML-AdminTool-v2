import { error, fail, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { NotificationCode } from '$lib/utils/notifications'
import { deleteUser } from '$lib/server/user'
import { BusinessError, ServerError } from '$lib/utils/errors'
import { logout } from '$lib/server/auth'
import { deleteSession } from '$lib/server/jwt'

export const load = (async () => {
  return {}
}) satisfies PageServerLoad

export const actions: Actions = {
  delete: async (event) => {
    const ip = event.getClientAddress()
    const user = event.locals.user

    if (user?.isAdmin) {
      throw error(403, { message: NotificationCode.FORBIDDEN })
    }

    try {
      await logout(event.cookies.get('session') ?? '')
      await deleteUser(user!.id)
      deleteSession(event)
    } catch (err) {
      if (err instanceof BusinessError) return fail(err.httpStatus, { failure: err.code })
      if (err instanceof ServerError) throw error(err.httpStatus, { message: err.code })
      
      console.error('Unknown error:', err)
      throw error(500, { message: NotificationCode.INTERNAL_SERVER_ERROR })
    }
  }
}