import type { VPS } from '$lib/utils/types'
import type { Update } from 'vite'
import type { PageServerLoad } from './$types'
import type { Environment, User } from '@prisma/client'
import { db } from '$lib/server/db'
import { error, redirect } from '@sveltejs/kit'
import { ServerError } from '$lib/utils/errors'
import { NotificationCode } from '$lib/utils/notifications'
import { getOS, getStorage } from '$lib/server/vps'
import { getUpdate } from '$lib/server/update'

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
      users = await db.user.findMany({ omit: { password: true } })
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
