import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async (event) => {
  if (event.locals.isConfigured) {
    throw redirect(302, '/dashboard')
  } else {
    throw redirect(302, '/setup')
  }
}) satisfies PageServerLoad
