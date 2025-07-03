import type { PageServerLoad } from './$types'

export const load = (async (event) => {
  return { env: event.locals.env }
}) satisfies PageServerLoad
