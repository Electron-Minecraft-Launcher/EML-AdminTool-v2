import { error } from '@sveltejs/kit'
import type { RequestHandler } from '../$types'
import { markAsConfigured } from '$lib/server/setup'
import { sleep } from '$lib/utils/utils'

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

  restartServer()

  return new Response(null, { status: 204 })
}

async function restartServer() {
  await sleep(100)
  process.exit(0)
}