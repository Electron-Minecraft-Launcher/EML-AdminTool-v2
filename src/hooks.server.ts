import type { Handle } from '@sveltejs/kit'
import pkg from '../package.json'
import { resetProcessEnv } from '$lib/server/setup'
import { db } from '$lib/server/db'
import type { LanguageCode } from '$lib/stores/language'

export const handle: Handle = async ({ event, resolve }) => {
  const isConfigured =
    process.env.IS_CONFIGURED === 'true' &&
    process.env.DATABASE_URL !== 'postgresql://eml:eml@db:5432/eml_admintool' &&
    process.env.DATABASE_URL !== undefined

  event.locals.isConfigured = isConfigured

  console.log('fails', process.env.DATABASE_URL)
  if (isConfigured) {
    try {
      const env = await db.environment.findFirst()
      event.locals.env = {
        language: (env?.language as LanguageCode) || 'en',
        name: env?.name || 'EML',
        theme: env?.theme || 'default',
        version: env?.version || pkg.version
      }
    } catch (error) {
      event.locals.env = {
        language: 'en',
        name: 'EML',
        theme: 'default',
        version: pkg.version
      }
    }
  } else {
    event.locals.env = {
      language: 'en',
      name: 'EML',
      theme: 'default',
      version: pkg.version
    }
  }

  const response = await resolve(event)
  return response
}
