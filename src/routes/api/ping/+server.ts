import type { RequestHandler } from './$types'
import pkg from '../../../../package.json'

export const GET: RequestHandler = async () => {
  return new Response(pkg.version)
}

