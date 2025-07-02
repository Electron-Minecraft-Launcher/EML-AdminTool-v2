import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load = (async () => {
  const isConfigured =
    process.env.IS_CONFIGURED === 'true' &&
    process.env.DATABASE_URL !== 'postgresql://eml:eml@db:5432/eml_admintool' &&
    process.env.DATABASE_URL !== undefined

    if (!isConfigured) {
      throw redirect(302, '/setup')
    }
}) satisfies LayoutServerLoad
