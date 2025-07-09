import { error, redirect, type Handle } from '@sveltejs/kit'
import pkg from '../package.json'
import { db } from '$lib/server/db'
import type { LanguageCode } from '$lib/stores/language'
import { verify } from '$lib/server/auth'
import { deleteSession } from '$lib/server/jwt'
import { BusinessError, ServerError } from '$lib/utils/errors'
import { NotificationCode } from '$lib/utils/notifications'

export const handle: Handle = async ({ event, resolve }) => {
  const isConfigured =
    process.env.IS_CONFIGURED === 'true' &&
    process.env.DATABASE_URL !== 'postgresql://eml:eml@db:5432/eml_admintool' &&
    process.env.DATABASE_URL !== undefined
  const session = event.cookies.get('session')

  event.locals.isConfigured = isConfigured

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

    if (session) {
      let user
      try {
        user = await verify(session)
      } catch (err) {
        deleteSession(event)
        if (err instanceof BusinessError) throw redirect(302, '/login')
        if (err instanceof ServerError) throw error(err.httpStatus, { message: err.code })

        console.error('Unknown error:', err)
        throw error(500, { message: NotificationCode.INTERNAL_SERVER_ERROR })
      }

      event.locals.user = {
        id: user.id,
        username: user.username,
        p_filesUpdater: user.p_filesUpdater as 0 | 1,
        p_loader: user.p_loader as 0 | 1,
        p_bootstraps: user.p_bootstraps as 0 | 1,
        p_maintenance: user.p_maintenance as 0 | 1,
        p_news: user.p_news as 0 | 1 | 2,
        p_newsCategories: user.p_newsCategories as 0 | 1,
        p_newsTags: user.p_newsTags as 0 | 1,
        p_backgrounds: user.p_backgrounds as 0 | 1,
        p_stats: user.p_stats as 0 | 1 | 2,
        isAdmin: user.isAdmin
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

  return await resolve(event)
}

