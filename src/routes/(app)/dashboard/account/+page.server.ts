import { error, fail, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { NotificationCode } from '$lib/utils/notifications'
import { deleteUser, updateUser } from '$lib/server/user'
import { BusinessError, ServerError } from '$lib/utils/errors'
import { logout } from '$lib/server/auth'
import { deleteSession } from '$lib/server/jwt'
import { editAccountSchema } from '$lib/utils/validations'
import { editEMLATName } from '$lib/server/emlat'
import bcrypt from 'bcrypt'

export const load = (async () => {
  return {}
}) satisfies PageServerLoad

export const actions: Actions = {
  edit: async (event) => {
    const user = event.locals.user
    const form = await event.request.formData()

    const raw = {
      username: form.get('username'),
      password: form.get('password')
    }

    const result = editAccountSchema.safeParse(raw)

    if (!result.success) {
      console.log(result)
      return fail(400, { failure: JSON.parse(result.error.message)[0].message })
    }

    const { username, password } = result.data

    try {
      if (password && password !== '') {
        const hashedPassword = await bcrypt.hash(password, 10)
        await updateUser(user!.id, { username, password: hashedPassword })
      } else {
        await updateUser(user!.id, { username })
      }

      if (user?.isAdmin) {
        await editEMLATName(username)
      }
    } catch (err) {
      if (err instanceof BusinessError) return fail(err.httpStatus, { failure: err.code })
      if (err instanceof ServerError) throw error(err.httpStatus, { message: err.code })

      console.error('Unknown error:', err)
      throw error(500, { message: NotificationCode.INTERNAL_SERVER_ERROR })
    }
  },

  delete: async (event) => {
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
