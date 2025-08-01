import { getLoader } from '$lib/server/loader'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { ILoaderFormat, ILoaderType } from '$lib/utils/db'

export const GET: RequestHandler = async () => {
  let loader

  try {
    loader = await getLoader()
  } catch (err) {
    console.error('Failed to get loader:', err)
    return json({ success: false, message: 'Failed to get loader' }, { status: 500 })
  }

  let res

  if (!loader) {
    res = {
      success: true,
      type: ILoaderType.VANILLA,
      minecraftVersion: 'latest_release',
      loaderVersion: 'latest_release',
      format: ILoaderFormat.CLIENT,
      file: null,
      updatedAt: new Date()
    }
  } else {
    res = {
      success: true,
      type: loader.type,
      minecraftVersion: loader.minecraftVersion,
      loaderVersion: loader.loaderVersion,
      format: loader.format,
      file: loader.file,
      updatedAt: loader.updatedAt
    }
  }

  return json(res)
}

