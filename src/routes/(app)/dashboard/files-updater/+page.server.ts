import { error, fail, redirect, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { NotificationCode } from '$lib/utils/notifications'
import { createFileSchema, editFileSchema, renameFileSchema, loaderSchema, uploadFilesSchema } from '$lib/utils/validations'
import { cacheFiles, createFile, deleteFile, editFile, getCachedFilesParsed, getFiles, renameFile, uploadFile } from '$lib/server/files'
import { BusinessError, ServerError } from '$lib/utils/errors'
import { db } from '$lib/server/db'
import type { Loader, LoaderFormat as LdFormat} from '@prisma/client'
import { checkForgeLoader, checkVanillaLoader, getForgeFile, getForgeVersions, getVanillaVersions, updateLoader } from '$lib/server/loader'
import path_ from 'path'
import pkg from '@prisma/client'
const { LoaderType, LoaderFormat } = pkg

export const load = (async (event) => {
  const domain = event.url.origin
  const user = event.locals.user

  if (!user?.p_filesUpdater) {
    throw redirect(303, '/dashboard')
  }

  try {
    const files = await getCachedFilesParsed(domain, 'files-updater')

    let loader
    try {
      loader = await db.loader.findFirst()
    } catch (err) {
      console.error('Failed to load loader:', err)
      throw new ServerError('Failed to load loader', err, NotificationCode.DATABASE_ERROR, 500)
    }

    if (!loader?.loaderVersion) {
      loader = {
        id: '',
        type: LoaderType.VANILLA,
        minecraftVersion: 'latest_release',
        loaderVersion: 'latest_release',
        format: LoaderFormat.CLIENT,
        file: null
      } as Loader
    }

    const loaderList = {
      [LoaderType.VANILLA]: await getVanillaVersions(),
      [LoaderType.FORGE]: await getForgeVersions()
    }

    return { loader, loaderList, files }
  } catch (err) {
    if (err instanceof ServerError) throw error(err.httpStatus, { message: err.code })

    console.error('Unknown error:', err)
    throw error(500, { message: NotificationCode.INTERNAL_SERVER_ERROR })
  }
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
      return fail(400, { failure: JSON.parse(result.error.message)[0].message })
    }

    const { path, name, newName } = result.data

    try {
      await renameFile('files-updater', path, name, newName)
      await cacheFiles(domain, 'files-updater')

      const files = await getFiles(domain, 'files-updater')
      return { files }
    } catch (err) {
      if (err instanceof BusinessError) return fail(err.httpStatus, { failure: err.message })
      if (err instanceof ServerError) throw error(err.httpStatus, { message: err.message })

      console.error('Unknown error:', err)
      throw error(500, { message: NotificationCode.INTERNAL_SERVER_ERROR })
    }
  },

  uploadFiles: async (event) => {
    const domain = event.url.origin
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

    try {
      for (const file of files) {
        if (!(file instanceof File)) continue

        const path = path_.join(currentPath, path_.dirname(file.webkitRelativePath ?? file.name))

        await uploadFile('files-updater', path, file)
        await cacheFiles(domain, 'files-updater')
      }

      const cache = await getCachedFilesParsed(domain, 'files-updater')
      return { files: cache }
    } catch (err) {
      if (err instanceof BusinessError) return fail(err.httpStatus, { failure: err.message })
      if (err instanceof ServerError) throw error(err.httpStatus, { message: err.message })

      console.error('Unknown error:', err)
      throw error(500, { message: NotificationCode.INTERNAL_SERVER_ERROR })
    }
  },

  createFile: async (event) => {
    const user = event.locals.user
    const domain = event.url.origin

    if (!user?.p_filesUpdater) {
      throw error(403, { message: NotificationCode.FORBIDDEN })
    }

    const form = await event.request.formData()
    const raw = {
      path: form.get('path'),
      name: form.get('name') ?? undefined
    }

    const result = createFileSchema.safeParse(raw)
    if (!result.success) {
      return fail(400, { failure: JSON.parse(result.error.message)[0].message })
    }

    const { path, name } = result.data

    try {
      await createFile('files-updater', path, name)
      await cacheFiles(domain, 'files-updater')

      const files = await getFiles(domain, 'files-updater')
      return { files }
    } catch (err) {
      if (err instanceof BusinessError) return fail(err.httpStatus, { failure: err.message })
      if (err instanceof ServerError) throw error(err.httpStatus, { message: err.message })

      console.error('Unknown error:', err)
      throw error(500, { message: NotificationCode.INTERNAL_SERVER_ERROR })
    }
  },

  editFile: async (event) => {
    const user = event.locals.user
    const domain = event.url.origin

    if (!user?.p_filesUpdater) {
      throw error(403, { message: NotificationCode.FORBIDDEN })
    }

    const form = await event.request.formData()
    const raw = {
      path: form.get('path'),
      name: form.get('name'),
      content: form.get('content')
    }

    const result = editFileSchema.safeParse(raw)
    if (!result.success) {
      return fail(400, { failure: JSON.parse(result.error.message)[0].message })
    }

    const { path, name, content } = result.data

    try {
      await editFile('files-updater', path, name, content)
      await cacheFiles(domain, 'files-updater')

      const files = await getFiles(domain, 'files-updater')
      return { files }
    } catch (err) {
      if (err instanceof BusinessError) return fail(err.httpStatus, { failure: err.message })
      if (err instanceof ServerError) throw error(err.httpStatus, { message: err.message })

      console.error('Unknown error:', err)
      throw error(500, { message: NotificationCode.INTERNAL_SERVER_ERROR })
    }
  },

  deleteFiles: async (event) => {
    const domain = event.url.origin
    const user = event.locals.user

    if (!user?.p_filesUpdater) {
      throw error(403, { message: NotificationCode.FORBIDDEN })
    }

    const form = await event.request.formData()
    const paths = form.getAll('paths')

    try {
      for (const path of paths) {
        if (typeof path !== 'string') continue

        await deleteFile('files-updater', path)
        await cacheFiles(domain, 'files-updater')
      }

      const cache = await getCachedFilesParsed(domain, 'files-updater')
      return { files: cache }
    } catch (err) {
      if (err instanceof BusinessError) return fail(err.httpStatus, { failure: err.message })
      if (err instanceof ServerError) throw error(err.httpStatus, { message: err.message })

      console.error('Unknown error:', err)
      throw error(500, { message: NotificationCode.INTERNAL_SERVER_ERROR })
    }
  },

  changeLoader: async (event) => {
    const user = event.locals.user

    if (user?.p_filesUpdater !== 2) {
      throw error(403, { message: NotificationCode.FORBIDDEN })
    }

    const form = await event.request.formData()
    const raw = {
      type: form.get('type'),
      minecraftVersion: form.get('minecraft-version'),
      loaderVersion: form.get('loader-version')
    }

    const result = loaderSchema.safeParse(raw)
    if (!result.success) {
      return fail(400, { failure: JSON.parse(result.error.message)[0].message })
    }

    const { type, minecraftVersion, loaderVersion } = result.data

    try {
      let file: any = null
      let format: LdFormat = LoaderFormat.CLIENT
      if (type === LoaderType.VANILLA) {
        checkVanillaLoader(minecraftVersion, loaderVersion)
      } else if (type === LoaderType.FORGE) {
        checkForgeLoader(minecraftVersion, loaderVersion)
        const res = await getForgeFile(loaderVersion)
        file = res.file
        format = res.format
      }

      const loader = { type, minecraftVersion, loaderVersion, format, file }

      await updateLoader(loader)
    } catch (err) {
      if (err instanceof BusinessError) return fail(err.httpStatus, { failure: err.message })
      if (err instanceof ServerError) throw error(err.httpStatus, { message: err.message })

      console.error('Unknown error:', err)
      throw error(500, { message: NotificationCode.INTERNAL_SERVER_ERROR })
    }
  }
}

