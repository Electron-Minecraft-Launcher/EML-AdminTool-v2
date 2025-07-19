import { error, fail } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { restartServer } from '$lib/server/setup'
import { deleteAllFiles, markAsUnconfigured, resetDatabase } from '$lib/server/reset'
import { BusinessError, ServerError } from '$lib/utils/errors'
import { NotificationCode } from '$lib/utils/notifications'

export const POST: RequestHandler = async (event) => {
  const user = event.locals.user

  if (!user?.isAdmin) {
    return error(403, { message: NotificationCode.FORBIDDEN })
  }

  try {
    markAsUnconfigured()
    await resetDatabase()
    await deleteAllFiles()
  } catch (err) {
    if (err instanceof BusinessError) throw fail(500, { failure: err.message })
    if (err instanceof ServerError) throw error(500, { message: err.message })

    console.error('Unknown error:', err)
    throw error(500, { message: NotificationCode.INTERNAL_SERVER_ERROR })
  }

  restartServer()

  return new Response(null, { status: 204 })
}
