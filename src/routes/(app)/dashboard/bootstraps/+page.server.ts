import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { db } from '$lib/server/db'
import { ServerError } from '$lib/utils/errors'
import { NotificationCode } from '$lib/utils/notifications'
import type { File as File_ } from '$lib/utils/types'

export const load = (async (event) => {
  const user = event.locals.user

  if (!user?.p_bootstraps) {
    return redirect(303, '/dashboard')
  }

  try {
    let bootstraps

    try {
      bootstraps = await db.bootstrap.findUnique({ where: { id: '1' } }) as { winFile: File_ | null; macFile: File_ | null; linFile: File_ | null; version: string }
    } catch (err) {
      console.error('Failed to load bootstraps:', err)
      throw new ServerError('Failed to load bootstraps', err, NotificationCode.DATABASE_ERROR, 500)
    }

    if (!bootstraps) {
      bootstraps = {
        winFile: null as null | File_,
        macFile: null as null | File_,
        linFile: null as null | File_,
        version: '',
      }
    }

    return { bootstraps }
  } catch (err) {
    if (err instanceof ServerError) throw error(err.httpStatus, { message: err.code })

    console.error('Unknown error:', err)
    throw error(500, { message: NotificationCode.INTERNAL_SERVER_ERROR })
  }
}) satisfies PageServerLoad



