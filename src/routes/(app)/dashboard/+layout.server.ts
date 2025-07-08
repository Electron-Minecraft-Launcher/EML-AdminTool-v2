import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load = (async (event) => {
  if (!event.locals.user) {
    console.log('hum !!!')
    throw redirect(303, '/login')
  }

  return {}
}) satisfies LayoutServerLoad
