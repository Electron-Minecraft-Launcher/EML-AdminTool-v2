import { getBootstraps } from '$lib/server/bootstraps'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async () => {
  let bootstraps

  try {
    bootstraps = await getBootstraps()
  } catch (err) {
    console.error('Failed to get bootstraps:', err)
    return error(500, { message: 'Failed to get bootstraps' })
  }

  const res = {
    success: true,
    version: bootstraps?.version ?? '',
    winFile: bootstraps?.winFile ?? null,
    macFile: bootstraps?.macFile ?? null,
    linFile: bootstraps?.linFile ?? null
  }

  return json(res)
}
