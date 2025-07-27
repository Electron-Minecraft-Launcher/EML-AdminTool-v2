import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load = (async (event) => {
  if (event.locals.isConfigured) {
    throw redirect(302, '/dashboard')
  }
}) satisfies LayoutServerLoad
