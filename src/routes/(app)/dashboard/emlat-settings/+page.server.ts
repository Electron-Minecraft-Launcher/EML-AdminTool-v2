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
import { editEMLATSchema, editUserSchema } from '$lib/utils/validations'
import { editEMLAT } from '$lib/server/emlat'
import { generateRandomPin, getPin } from '$lib/server/pin'
import type { LanguageCode } from '$lib/stores/language'
import { deleteUser, updateUser } from '$lib/server/user'
import { markAsUnconfigured, resetDatabase } from '$lib/server/reset'
import { restartServer } from '$lib/server/setup'
import { deleteFiles } from '$lib/server/files'
import { checkSession } from '$lib/server/jwt'
import { verify } from '$lib/server/auth'

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
      users = await db.user.findMany({ omit: { password: true }, orderBy: { username: 'asc' } })
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
    const user = event.locals.user
    const session = event.cookies.get('session') ?? ''

    if (!user?.isAdmin) {
      throw error(403, { message: NotificationCode.FORBIDDEN })
    }

    const user_ = await verify(session) // Oversecurity measure to ensure the user is still valid
    if (!user_?.isAdmin) {
      throw error(403, { message: NotificationCode.FORBIDDEN })
    }

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
      if (err instanceof BusinessError) return fail(err.httpStatus, { failure: err.code })
      if (err instanceof ServerError) throw error(err.httpStatus, { message: err.code })

      console.error('Unknown error:', err)
      throw error(500, { message: NotificationCode.INTERNAL_SERVER_ERROR })
    }
  },

  editUser: async (event) => {
    const ip = event.getClientAddress()
    const user = event.locals.user

    if (!user?.isAdmin) {
      throw error(403, { message: NotificationCode.FORBIDDEN })
    }

    const form = await event.request.formData()

    const raw = {
      userId: form.get('user-id')?.toString(),
      username: form.get('username')?.toString(),
      p_filesUpdater_1: form.get('p_files-updater_1')?.toString() === 'on',
      p_filesUpdater_2: form.get('p_files-updater_2')?.toString() === 'on',
      p_bootstraps: form.get('p_bootstraps')?.toString() === 'on',
      p_maintenance: form.get('p_maintenance')?.toString() === 'on',
      p_news_1: form.get('p_news_1')?.toString() === 'on',
      p_news_2: form.get('p_news_2')?.toString() === 'on',
      p_newsCategories: form.get('p_news-categories')?.toString() === 'on',
      p_newsTags: form.get('p_news-tags')?.toString() === 'on',
      p_backgrounds: form.get('p_backgrounds')?.toString() === 'on',
      p_stats_1: form.get('p_stats_1')?.toString() === 'on',
      p_stats_2: form.get('p_stats_2')?.toString() === 'on'
    }

    const result = editUserSchema.safeParse(raw)

    if (!result.success) {
      return fail(400, { failure: result.error.message })
    }

    const userId = result.data.userId
    const username = result.data.username
    const status = UserStatus.ACTIVE
    const p_filesUpdater = result.data.p_filesUpdater_2 ? 2 : result.data.p_filesUpdater_1 ? 1 : 0
    const p_bootstraps = result.data.p_bootstraps ? 1 : 0
    const p_maintenance = result.data.p_maintenance ? 1 : 0
    const p_news = result.data.p_news_2 ? 2 : result.data.p_news_1 || result.data.p_newsCategories || result.data.p_newsTags ? 1 : 0
    const p_newsCategories = result.data.p_newsCategories ? 1 : 0
    const p_newsTags = result.data.p_newsTags ? 1 : 0
    const p_backgrounds = result.data.p_backgrounds ? 1 : 0
    const p_stats = result.data.p_stats_2 ? 2 : result.data.p_stats_1 ? 1 : 0

    try {
      await updateUser(userId, {
        username,
        status,
        p_filesUpdater,
        p_bootstraps,
        p_maintenance,
        p_news,
        p_newsCategories,
        p_newsTags,
        p_backgrounds,
        p_stats
      })

      return { success: true }
    } catch (err) {
      if (err instanceof BusinessError) return fail(err.httpStatus, { failure: err.code })
      if (err instanceof ServerError) throw error(err.httpStatus, { message: err.code })

      console.error('Unknown error:', err)
      throw error(500, { message: NotificationCode.INTERNAL_SERVER_ERROR })
    }
  },

  refuseUser: refuseDeleteUser,

  deleteUser: refuseDeleteUser,

  deleteUserForever: async (event) => {
    const ip = event.getClientAddress()
    const user = event.locals.user

    if (!user?.isAdmin) {
      throw error(403, { message: NotificationCode.FORBIDDEN })
    }

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
  const user = event.locals.user

  if (!user?.isAdmin) {
    throw error(403, { message: NotificationCode.FORBIDDEN })
  }

  const form = await event.request.formData()

  const userId = form.get('user-id')?.toString()

  if (!userId) {
    return { failure: NotificationCode.MISSING_INPUT }
  }

  try {
    await updateUser(userId, {
      status: UserStatus.DELETED,
      p_filesUpdater: 0,
      p_bootstraps: 0,
      p_maintenance: 0,
      p_news: 0,
      p_newsCategories: 0,
      p_newsTags: 0,
      p_backgrounds: 0,
      p_stats: 0
    })

    return { success: true }
  } catch (err) {
    if (err instanceof BusinessError) return fail(err.httpStatus, { failure: err.code })
    if (err instanceof ServerError) throw error(err.httpStatus, { message: err.code })

    console.error('Unknown error:', err)
    throw error(500, { message: NotificationCode.INTERNAL_SERVER_ERROR })
  }
}
