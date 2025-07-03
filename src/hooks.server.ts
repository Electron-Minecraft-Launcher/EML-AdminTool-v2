import type { Handle } from '@sveltejs/kit'
import pkg from '../package.json'

export const handle: Handle = async ({ event, resolve }) => {
  const isConfigured =
    process.env.IS_CONFIGURED === 'true' &&
    process.env.DATABASE_URL !== 'postgresql://eml:eml@db:5432/eml_admintool' &&
    process.env.DATABASE_URL !== undefined

  event.locals.isConfigured = isConfigured

  if (isConfigured) {
    // TODO Check user and get env
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
