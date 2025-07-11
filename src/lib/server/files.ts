import { BusinessError } from '$lib/utils/errors'
import { NotificationCode } from '$lib/utils/notifications'
import fs from 'fs'
import path_ from 'path'

export function deleteFiles(dir: 'files-updater' | 'bootstraps' | 'backgrounds' | 'images', paths: string[]) {
  paths.forEach((path) => {
    try {
      path = sanitize('files', dir, path)
    } catch (err) {
      console.warn('Invalid path:', path)
      throw new BusinessError('Invalid path', NotificationCode.INVALID_REQUEST, 400)
    }

    if (!fs.existsSync(path)) {
      console.warn('Path does not exist:', path)
      throw new BusinessError('Path does not exist', NotificationCode.NOT_FOUND, 404)
    }

    fs.rmSync(path, { recursive: true })
  })
}

function sanitize(...path: string[]): string {
  const root = path_.join(process.cwd())
  const p = path_.join(...path).replace(/^\\+/, '')
  const sanitizedPath = path_.resolve(root, p)
  if (!sanitizedPath.startsWith(root)) {
    throw 'Invalid path'
  }
  return sanitizedPath
}