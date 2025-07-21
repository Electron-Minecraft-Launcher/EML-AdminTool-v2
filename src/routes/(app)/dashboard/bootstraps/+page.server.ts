import { error, fail, redirect, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { db } from '$lib/server/db'
import { BusinessError, ServerError } from '$lib/utils/errors'
import { NotificationCode } from '$lib/utils/notifications'
import type { File as File_ } from '$lib/utils/types'
import { changeBootstrapsSchema } from '$lib/utils/validations'
import { getBootstraps, updateBootstraps } from '$lib/server/bootstraps'
import semver from 'semver'
import { deleteFile, uploadFile } from '$lib/server/files'

export const load = (async (event) => {
  const user = event.locals.user

  if (!user?.p_bootstraps) {
    throw redirect(303, '/dashboard')
  }

  try {
    let bootstraps

    try {
      bootstraps = (await db.bootstrap.findUnique({ where: { id: '1' } })) as {
        winFile: File_ | null
        macFile: File_ | null
        linFile: File_ | null
        version: string
      }
    } catch (err) {
      console.error('Failed to load bootstraps:', err)
      throw new ServerError('Failed to load bootstraps', err, NotificationCode.DATABASE_ERROR, 500)
    }

    if (!bootstraps) {
      bootstraps = {
        winFile: null as null | File_,
        macFile: null as null | File_,
        linFile: null as null | File_,
        version: ''
      }
    }

    return { bootstraps }
  } catch (err) {
    if (err instanceof ServerError) throw error(err.httpStatus, { message: err.code })

    console.error('Unknown error:', err)
    throw error(500, { message: NotificationCode.INTERNAL_SERVER_ERROR })
  }
}) satisfies PageServerLoad

export const actions: Actions = {
  changeBootstraps: async (event) => {
    const user = event.locals.user

    if (!user?.p_bootstraps) {
      return { error: NotificationCode.UNAUTHORIZED }
    }

    const form = await event.request.formData()
    const raw = {
      newVersion: form.get('new-version'),
      name: form.get('name'),
      winFile: form.get('win-file'),
      macFile: form.get('mac-file'),
      linFile: form.get('lin-file')
    }

    const result = changeBootstrapsSchema.safeParse(raw)
    if (!result.success) {
      return fail(400, { failure: JSON.parse(result.error.message)[0].message })
    }

    const { newVersion, name, winFile, macFile, linFile } = result.data

    try {
      if (!semver.valid(newVersion)) {
        console.warn('Invalid version:', newVersion)
        throw new BusinessError('Invalid version format', NotificationCode.BOOTSTRAPS_MALFORMED_VERSION, 400)
      }

      const currentBootstraps = await getBootstraps()
      if (currentBootstraps && !semver.gt(newVersion, currentBootstraps.version)) {
        console.warn('Invalid bootstraps version:', newVersion, currentBootstraps.version)
        throw new BusinessError('Invalid bootstraps version', NotificationCode.BOOTSTRAPS_INVALID_VERSION, 400)
      }

      const winExt = winFile.name.split('.').pop() ?? ''
      const macExt = macFile.name.split('.').pop() ?? ''
      const linExt = linFile.name.split('.').pop() ?? ''

      const newWinFile = new File([winFile], `${name.toLowerCase()}-launcher_win-${newVersion}.${winExt}`, { type: winFile.type })
      const newMacFile = new File([macFile], `${name.toLowerCase()}-launcher_mac-${newVersion}.${macExt}`, { type: macFile.type })
      const newLinFile = new File([linFile], `${name.toLowerCase()}-launcher_lin-${newVersion}.${linExt}`, { type: linFile.type })

      try {
        await deleteFile('bootstraps', '')
      } catch (err) {
        console.warn('Failed to delete existing bootstrap files (maybe the bootstraps folder is already deleted):', err)
      }

      await uploadFile('bootstraps', 'win', newWinFile)
      await uploadFile('bootstraps', 'mac', newMacFile)
      await uploadFile('bootstraps', 'lin', newLinFile)

      await updateBootstraps(newVersion, currentBootstraps)

      return { success: true }
    } catch (err) {
      if (err instanceof BusinessError) return fail(err.httpStatus, { failure: err.code })
      if (err instanceof ServerError) throw error(err.httpStatus, { message: err.code })

      console.error('Unknown error:', err)
      throw error(500, { message: NotificationCode.INTERNAL_SERVER_ERROR })
    }
  },

  deleteBootstrap: async (event) => {
    const user = event.locals.user

    if (!user?.p_bootstraps) {
      throw error(403, { message: NotificationCode.FORBIDDEN })
    }

    const form = await event.request.formData()
    const platform = form.get('platform')

    if (typeof platform !== 'string' || !['win', 'mac', 'lin'].includes(platform)) {
      return fail(400, { failure: NotificationCode.INVALID_REQUEST })
    }

    try {
      try {
        await deleteFile('bootstraps', platform)
      } catch (err) {
        console.error('Failed to delete bootstrap file:', err)
        throw new ServerError('Failed to delete bootstrap file', err, NotificationCode.INTERNAL_SERVER_ERROR, 500)
      }

      try {
        await db.bootstrap.update({ where: { id: '1' }, data: { [`${platform}File`]: null } })
      } catch (err) {
        console.error('Failed to update bootstrap:', err)
        throw new ServerError('Failed to update bootstrap', err, NotificationCode.DATABASE_ERROR, 500)
      }

      return { success: true }
    } catch (err) {
      if (err instanceof BusinessError) return fail(err.httpStatus, { failure: err.code })
      if (err instanceof ServerError) throw error(err.httpStatus, { message: err.code })

      console.error('Unknown error:', err)
      throw error(500, { message: NotificationCode.INTERNAL_SERVER_ERROR })
    }
  }
}

