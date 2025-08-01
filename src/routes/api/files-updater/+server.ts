import { getCachedFiles } from '$lib/server/files'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async (event) => {
  const domain = event.url.origin
  const cache = await getCachedFiles(domain, 'files-updater')
  return new Response(`{"success": true, "files": ${cache}}`, { headers: { 'Content-Type': 'application/json' } })
}

