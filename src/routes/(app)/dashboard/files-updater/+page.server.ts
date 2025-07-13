import type { File } from '$lib/utils/types'
import { error, fail, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { NotificationCode } from '$lib/utils/notifications'
import { renameFileSchema } from '$lib/utils/validations'
import { getFiles, renameFile } from '$lib/server/files'
import { BusinessError, ServerError } from '$lib/utils/errors'
import { GET } from '../../../api/files-updater/+server'

export const load = (async () => {
  return {}
}) satisfies PageServerLoad

export const actions: Actions = {
  renameFile: async (event) => {
    const user = event.locals.user
    const domain = event.url.origin

    if (!user?.p_filesUpdater) {
      throw error(403, { message: NotificationCode.FORBIDDEN })
    }

    const form = await event.request.formData()
    const raw = {
      path: form.get('path'),
      name: form.get('name'),
      newName: form.get('new-name')
    }

    const result = renameFileSchema.safeParse(raw)
    if (!result.success) {
      return error(400, { message: JSON.parse(result.error.message)[0].message })
    }

    const { path, name, newName } = result.data

    try {
      console.log(path, name, newName)
      renameFile('files-updater', path, name, newName)

      const files = getFiles(domain, 'files-updater')

      return { success: true, files }
    } catch (err) {
      if (err instanceof BusinessError) return fail(err.httpStatus, { failure: err.message })
      if (err instanceof ServerError) throw error(err.httpStatus, { message: err.message })

      console.error('Unknown error:', err)
      throw error(500, { message: NotificationCode.INTERNAL_SERVER_ERROR })
    }
  }
}

