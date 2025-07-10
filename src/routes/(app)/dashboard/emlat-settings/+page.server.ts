import type { VPS } from '$lib/utils/types'
import type { Update } from 'vite'
import type { PageServerLoad } from './$types'
import { UserStatus, type Environment, type User } from '@prisma/client'
import { db } from '$lib/server/db'
import { error, fail, redirect, type Actions, type RequestEvent } from '@sveltejs/kit'
import { BusinessError, ServerError } from '$lib/utils/errors'
import { NotificationCode } from '$lib/utils/notifications'
import { getOS, getStorage } from '$lib/server/vps'
import { getUpdate } from '$lib/server/update'
import { editEMLATSchema } from '$lib/utils/validations'
import { editEMLAT } from '$lib/server/emlat'
import { generateRandomPin, getPin } from '$lib/server/pin'
import type { LanguageCode } from '$lib/stores/language'
import { deleteUser, updateUser } from '$lib/server/user'

export const load = (async (event) => {
  const ip = event.getClientAddress()
  const user = event.locals.user

  if (!user?.isAdmin) {
    return redirect(303, '/dashboard')
  }

  let environment
  let users
  let vps
  let update

  try {
    try {
      environment = (await db.environment.findFirst())!
    } catch (err) {
      console.error('Failed to load environment:', err)
      throw new ServerError('Failed to load environment', err, NotificationCode.DATABASE_ERROR, 500)
    }

    try {
      users = await db.user.findMany({ omit: { password: true }, orderBy: { isAdmin: 'asc', username: 'asc' } })
    } catch (err) {
      console.error('Failed to load users:', err)
      throw new ServerError('Failed to load users', err, NotificationCode.DATABASE_ERROR, 500)
    }

    try {
      vps = { os: getOS(), storage: getStorage() }
    } catch (err) {
      console.error('Failed to get VPS information:', err)
      throw new ServerError('Failed to load VPS information', err, NotificationCode.INTERNAL_SERVER_ERROR, 500)
    }

    try {
      update = await getUpdate()
    } catch (err) {
      throw new ServerError('Failed to load update information', err, NotificationCode.EXTERNAL_API_ERROR, 500)
    }

    return { environment, users, vps, update }
  } catch (err) {
    if (err instanceof ServerError) throw error(err.httpStatus, { message: err.code })

    console.error('Unknown error:', err)
    throw error(500, { message: NotificationCode.INTERNAL_SERVER_ERROR })
  }
}) satisfies PageServerLoad

export const actions: Actions = {
  editEMLAT: async (event) => {
    const ip = event.getClientAddress()
    const form = await event.request.formData()

    const raw = {
      name: form.get('name')?.toString(),
      language: form.get('language')?.toString(),
      regeneratePin: form.get('regenerate-pin')?.toString() === 'on'
    }

    const result = editEMLATSchema.safeParse(raw)

    if (!result.success) {
      return { failure: result.error.message }
    }

    const { name, language, regeneratePin } = result.data

    try {
      const newPin = regeneratePin ? generateRandomPin() : await getPin()
      await editEMLAT(name, language as LanguageCode, newPin)
    } catch (err) {
      if (err instanceof ServerError) throw error(err.httpStatus, { message: err.code })

      console.error('Unknown error:', err)
      throw error(500, { message: NotificationCode.INTERNAL_SERVER_ERROR })
    }
  },

  refuseUser: refuseDeleteUser,

  deleteUser: refuseDeleteUser,

  deleteUserForever: async (event) => {
    const ip = event.getClientAddress()
    const form = await event.request.formData()

    const userId = form.get('user-id')?.toString()

    if (!userId) {
      return { failure: 'User ID is required' }
    }

    try {
      await deleteUser(userId)
    } catch (err) {
      if (err instanceof BusinessError) return fail(err.httpStatus, { failure: err.code })
      if (err instanceof ServerError) throw error(err.httpStatus, { message: err.code })

      console.error('Unknown error:', err)
      throw error(500, { message: NotificationCode.INTERNAL_SERVER_ERROR })
    }
  }
}

async function refuseDeleteUser(event: RequestEvent<Partial<Record<string, string>>, string | null>) {
  const ip = event.getClientAddress()
  const form = await event.request.formData()

  const userId = form.get('user-id')?.toString()

  if (!userId) {
    return { failure: 'User ID is required' }
  }

  try {
    await updateUser(userId, { status: UserStatus.DELETED })

    return { success: true }
  } catch (err) {
    if (err instanceof BusinessError) return fail(err.httpStatus, { failure: err.code })
    if (err instanceof ServerError) throw error(err.httpStatus, { message: err.code })

    console.error('Unknown error:', err)
    throw error(500, { message: NotificationCode.INTERNAL_SERVER_ERROR })
  }
}
