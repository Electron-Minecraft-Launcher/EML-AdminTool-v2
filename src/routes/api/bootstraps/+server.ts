import { getBootstraps } from '$lib/server/bootstraps'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { NotificationCode } from '$lib/utils/notifications'
import { deleteFile } from '$lib/server/files'
import { db } from '$lib/server/db'

export const GET: RequestHandler = async () => {
  const bootstraps = await getBootstraps()
  const res = {
    success: true,
    version: bootstraps?.version || '',
    winFile: bootstraps?.winFile || null,
    macFile: bootstraps?.macFile || null,
    linFile: bootstraps?.linFile || null
  }

  return json(res)
}

export const DELETE = async (event) => {
  const user = event.locals.user

  if (!user?.p_bootstraps) {
    throw error(403, { message: NotificationCode.FORBIDDEN })
  }

  const formData = await event.request.formData()
  const platform = formData.get('platform')

  if (typeof platform !== 'string' || !['win', 'mac', 'lin'].includes(platform)) {
    return error(400, { message: NotificationCode.INVALID_REQUEST })
  }

  try {
    await deleteFile('bootstraps', platform)
  } catch (err) {
    console.error('Failed to delete bootstrap file:', err)
    throw error(500, { message: NotificationCode.INTERNAL_SERVER_ERROR })
  }

  try {
    await db.bootstrap.update({
      where: { id: '1' },
      data: {
        [`${platform}File`]: null
      }
    })
  } catch (err) {
    console.error('Failed to update bootstraps in database:', err)
    throw error(500, { message: NotificationCode.DATABASE_ERROR })
  }

  return GET(event)
}
