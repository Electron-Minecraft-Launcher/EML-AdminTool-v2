import { error } from '@sveltejs/kit'
import type { RequestHandler } from '../$types'
import { markAsConfigured } from '$lib/server/setup'

export const POST: RequestHandler = async (event) => {
  if (event.locals.isConfigured) {
    error(400, { message: 'Already configured' })
  }

  const ip = event.getClientAddress()

  try {
    await markAsConfigured()
  } catch (err) {
    console.error('Error marking as configured:', err)
    error(500)
  }

  return new Response(null, { status: 204 })
}
