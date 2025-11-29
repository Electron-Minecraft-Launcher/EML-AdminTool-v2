import { error, redirect, type Handle, type RequestEvent } from '@sveltejs/kit'
import { env as dynEnv } from '$env/dynamic/private'
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
import { dev } from '$app/environment'

const filesDir = path.resolve(process.cwd(), 'files')

export const handle: Handle = async ({ event, resolve }) => {
  const securityResponse = handleSecurityBlocking(event)
  if (securityResponse) return securityResponse

  if (event.url.pathname.startsWith('/files/')) {
    return serveStaticFile(event.url.pathname)
  }

  await loadApplicationContext(event)

  const response = await resolve(event)

  return injectCorsHeaders(response, event)
}

function getAllowedOrigins() {
  const allowed = (process.env.ALLOWED_ORIGINS ?? '').split(',').map((o) => o.trim())
  if (dynEnv.ORIGIN) allowed.push(dynEnv.ORIGIN)
  return allowed.filter(Boolean)
}

function handleSecurityBlocking(event: RequestEvent) {
  if (dev) return null

  const requestOrigin = event.request.headers.get('origin')
  const method = event.request.method
  const allowedOrigins = getAllowedOrigins()

  if (method === 'OPTIONS') {
    if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Origin': requestOrigin,
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true'
        }
      })
    }
    return new Response(null)
  }

  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    if (requestOrigin && !allowedOrigins.includes(requestOrigin)) {
      console.error(`CSRF Blocked: ${requestOrigin} is not allowed.`)
      return new Response(JSON.stringify({ message: 'Forbidden: Invalid Origin' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }

  return null
}

function injectCorsHeaders(response: Response, event: RequestEvent): Response {
  if (dev) {
    const requestOrigin = event.request.headers.get('origin')
    if (requestOrigin) {
      response.headers.set('Access-Control-Allow-Origin', requestOrigin)
      response.headers.set('Access-Control-Allow-Credentials', 'true')
    }
    return response
  }

  const requestOrigin = event.request.headers.get('origin')
  const allowedOrigins = getAllowedOrigins()

  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    response.headers.set('Access-Control-Allow-Origin', requestOrigin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  return response
}

function serveStaticFile(pathname: string) {
  const relativePath = pathname.substring('/files/'.length)
  const resolvedPath = path.resolve(path.join(filesDir, relativePath))

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
        'Content-Type': mimeType,
        'X-Content-Type-Options': 'nosniff'
      }
    })
  }

  return new Response('File not found', { status: 404 })
}

async function loadApplicationContext(event: RequestEvent) {
  event.locals.isConfigured = checkIsConfigured()

  if (!event.locals.isConfigured) {
    event.locals.env = getDefaultEnv()
    return
  }

  try {
    const envData = await db.environment.findFirst()
    event.locals.env = {
      language: (envData?.language as LanguageCode) ?? 'en',
      name: envData?.name ?? 'EML',
      theme: envData?.theme ?? 'default',
      version: pkg.version
    }
  } catch (err) {
    console.error('Failed to load environment:', err)
    event.locals.env = getDefaultEnv()
  }

  const session = event.cookies.get('session')
  if (session) {
    await handleUserSession(event, session)
  }
}

async function handleUserSession(event: RequestEvent, session: string) {
  try {
    const user = await verify(session)
    event.locals.user = getUserInfo(user)
  } catch (err) {
    deleteSession(event)

    if (err instanceof BusinessError) throw redirect(302, '/login')
    if (err instanceof ServerError) throw error(err.httpStatus, { message: err.code })

    console.error('Unknown session error:', err)
    throw error(500, { message: NotificationCode.INTERNAL_SERVER_ERROR })
  }
}

function checkIsConfigured() {
  return process.env.IS_CONFIGURED === 'true' && process.env.DATABASE_URL !== defaultPgURL && process.env.DATABASE_URL !== undefined
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

