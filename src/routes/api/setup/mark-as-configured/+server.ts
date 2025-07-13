import { error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { markAsConfigured, restartServer } from '$lib/server/setup'
import { ServerError } from '$lib/utils/errors'
import { NotificationCode } from '$lib/utils/notifications'

export const POST: RequestHandler = async (event) => {
  if (event.locals.isConfigured) {
    throw error(400, { message: 'Already configured' })
  }

  try {
    await markAsConfigured()
  } catch (err) {
    console.error('Error marking as configured:', err)
    if (err instanceof ServerError) throw error(500, {message: err.message})
    else throw error(500, { message: NotificationCode.INTERNAL_SERVER_ERROR })
  }

  restartServer()

  return new Response(null, { status: 204 })
}
