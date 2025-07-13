import { deleteFile, getFiles, uploadFile } from '$lib/server/files'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { NotificationCode } from '$lib/utils/notifications'
import path_ from 'path'
import { deleteFilesSchema, uploadFilesSchema } from '$lib/utils/validations'

export const GET: RequestHandler = async (event) => {
  const domain = event.url.origin
  return json({ success: true, files: getFiles(domain, 'files-updater') })
}

export const POST: RequestHandler = async (event) => {
  const user = event.locals.user

  if (!user?.p_filesUpdater) {
    throw error(403, { message: NotificationCode.FORBIDDEN })
  }

  const form = await event.request.formData()
  const raw = {
    currentPath: form.get('current-path'),
    files: form.getAll('files')
  }

  const result = uploadFilesSchema.safeParse(raw)

  if (!result.success) {
    return error(400, { message: JSON.parse(result.error.message)[0].message })
  }

  const { currentPath, files } = result.data

  for (const file of files) {
    if (!(file instanceof File)) continue

    const path = path_.join(currentPath, path_.dirname(file.webkitRelativePath ?? file.name))
    console.log(file.webkitRelativePath, file.name)

    try {
      await uploadFile('files-updater', path, file)
    } catch (err) {
      console.error('Error uploading file:', err)
      throw error(500, { message: NotificationCode.INTERNAL_SERVER_ERROR })
    }
  }

  return GET(event)
}

export const DELETE: RequestHandler = async (event) => {
  const user = event.locals.user

  if (!user?.p_filesUpdater) {
    throw error(403, { message: NotificationCode.FORBIDDEN })
  }

  const form = await event.request.formData()
  const raw = {
    paths: form.getAll('paths')
  }

  const result = deleteFilesSchema.safeParse(raw)

  if (!result.success) {
    return error(400, { message: JSON.parse(result.error.message)[0].message })
  }

  const { paths } = result.data

  for (const path of paths) {
    try {
      deleteFile('files-updater', path)
    } catch (err) {
      console.error('Error deleting file:', err)
      throw error(500, { message: NotificationCode.INTERNAL_SERVER_ERROR })
    }
  }

  return GET(event)
}
