import { error, fail, redirect, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { NotificationCode } from '$lib/utils/notifications'
import { createFileSchema, editFileSchema, renameFileSchema } from '$lib/utils/validations'
import { createFile, editFile, getFiles, renameFile } from '$lib/server/files'
import { BusinessError, ServerError } from '$lib/utils/errors'
import { db } from '$lib/server/db'
import { type Loader, LoaderType, LoaderFormat } from '@prisma/client'
import type { LoaderVersion } from '$lib/utils/types'

export const load = (async (event) => {
  const user = event.locals.user

  if (!user?.p_filesUpdater) {
    return redirect(303, '/dashboard')
  }

  let loader

  try {
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

    return { loader, loaderList }
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
      renameFile('files-updater', path, name, newName)

      const files = getFiles(domain, 'files-updater')
      return { success: true, files }
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
      createFile('files-updater', path, name)

      const files = getFiles(domain, 'files-updater')
      return { success: true, files }
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
      console.log(path, name)
      editFile('files-updater', path, name, content)

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

async function getVanillaVersions() {
  let response
  try {
    response = await (await fetch('https://piston-meta.mojang.com/mc/game/version_manifest.json')).json()
  } catch (err) {
    console.error('Failed to fetch Minecraft versions:', err)
    throw new ServerError('Failed to fetch Minecraft versions', err, NotificationCode.EXTERNAL_API_ERROR, 500)
  }

  let versions = [
    { minecraftVersion: 'Latest', loaderVersion: 'latest_release', type: ['release'] },
    { minecraftVersion: 'Latest', loaderVersion: 'latest_snapshot', type: ['snapshot'] }
  ]

  let release = 'Latest'
  for (const version of response.versions) {
    if (version.type === 'release') release = version.id.split('.').slice(0, 2).join('.')
    versions.push({
      minecraftVersion: release,
      loaderVersion: version.id,
      type: [version.type]
    })
  }

  return versions as LoaderVersion[]
}

async function getForgeVersions() {
  let res1, res2
  try {
    res1 = await (await fetch('https://files.minecraftforge.net/net/minecraftforge/forge/maven-metadata.json')).json()
    res2 = await (await fetch('https://files.minecraftforge.net/maven/net/minecraftforge/forge/promotions_slim.json')).json()
  } catch (err) {
    console.error('Failed to fetch Forge versions:', err)
    throw new ServerError('Failed to fetch Forge versions', err, NotificationCode.EXTERNAL_API_ERROR, 500)
  }

  let versions = []
  for (const [version, data] of Object.entries(res1)) {
    versions.push(
      ...(data as any).map((v: any) => ({
        minecraftVersion: version.split('.').slice(0, 2).join('.'),
        loaderVersion: v,
        type: ['default' as const]
      }))
    )
  }

  for (const [version, data] of Object.entries(res2.promos)) {
    const minecraftVersion = version.split('-')[0]
    const type = version.split('-')[1] as 'recommended' | 'latest'
    const i = versions.findIndex((v) => v.loaderVersion.startsWith(`${minecraftVersion}-${data}`))
    versions[i].type =
      (versions[i].type.includes('recommended') || versions[i].type.includes('latest')) && !versions[i].type.includes(type)
        ? ['latest', 'recommended']
        : [type]
  }

  return versions.reverse() as LoaderVersion[]
}

