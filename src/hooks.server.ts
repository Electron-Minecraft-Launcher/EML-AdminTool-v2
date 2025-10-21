import { error, redirect, type Handle } from '@sveltejs/kit'
import pkg from '../package.json'
import { db } from '$lib/server/db'
import type { LanguageCode } from '$lib/stores/language'
import { verify } from '$lib/server/auth'
import { deleteSession } from '$lib/server/jwt'
import { BusinessError, ServerError } from '$lib/utils/errors'
import { NotificationCode } from '$lib/utils/notifications'
import { type User } from '$lib/utils/db'
import { defaultPgURL } from '$lib/server/setup'
import path from 'node:path'
import fs from 'node:fs'
import mime from 'mime-types'

const filesDir = path.resolve(process.cwd(), 'files')

export const handle: Handle = async ({ event, resolve }) => {
  const session = event.cookies.get('session')
  const url = event.url

  if (url.pathname.startsWith('/files/')) {
    const filePath = path.join(filesDir, url.pathname.substring('/files/'.length))

    const resolvedPath = path.resolve(filePath)
    if (!resolvedPath.startsWith(filesDir)) {
      return new Response('Forbidden', { status: 403 })
    }

    if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isFile()) {
      const extension = path.extname(resolvedPath).toLowerCase()
      let mimeType: string

      if (['.ts', '.js', '.jsx', '.tsx', '.svelte', '.vue', '.css', '.html'].includes(extension)) {
        mimeType = 'text/plain; charset=utf-8'
      } else {
        mimeType = mime.lookup(resolvedPath) || 'application/octet-stream'
      }

      const fileContent = fs.readFileSync(resolvedPath)

      return new Response(fileContent, {
        status: 200,
        headers: {
          'Content-Type': mimeType
        }
      })
    }

    return new Response('File not found', { status: 404 })
  }

  event.locals.isConfigured = isConfigured()

  if (event.locals.isConfigured) {
    try {
      const env = await db.environment.findFirst()
      event.locals.env = {
        language: (env?.language as LanguageCode) ?? 'en',
        name: env?.name ?? 'EML',
        theme: env?.theme ?? 'default',
        version: pkg.version
      }
    } catch (err) {
      console.error('Failed to load environment:', err)
      event.locals.env = getDefaultEnv()
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

      event.locals.user = getUserInfo(user)
    }
  } else {
    event.locals.env = getDefaultEnv()
  }

  return await resolve(event)
}

function isConfigured() {
  return (
    process.env.IS_CONFIGURED === 'true' &&
    process.env.DATABASE_URL !== defaultPgURL &&
    process.env.DATABASE_URL !== undefined
  )
}

function getDefaultEnv() {
  return {
    language: 'en' as LanguageCode,
    name: 'EML',
    theme: 'default',
    version: pkg.version
  }
}

function getUserInfo(user: User) {
  return {
    id: user.id,
    username: user.username,
    p_filesUpdater: user.p_filesUpdater as 0 | 1,
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




