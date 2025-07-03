import type { LayoutServerLoad } from './$types'

export const load = (async (event) => {
  return { env: event.locals.env }
}) satisfies LayoutServerLoad
