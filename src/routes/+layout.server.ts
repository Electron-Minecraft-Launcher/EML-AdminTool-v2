import type { LayoutServerLoad } from './$types'
import '$lib/utils/prototypes'

export const load = (async (event) => {
  return { env: event.locals.env }
}) satisfies LayoutServerLoad
