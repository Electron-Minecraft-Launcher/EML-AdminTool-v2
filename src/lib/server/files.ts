import { BusinessError, ServerError } from '$lib/utils/errors'
import { NotificationCode } from '$lib/utils/notifications'
import fs from 'fs'
import path_ from 'path'
import type { Dir, File as File_ } from '$lib/utils/types'
import crypto from 'crypto'

const root = path_.join(process.cwd())

export function getFiles(domain: string, dir: Dir) {
  const filesArray: File_[] = []
  browse(filesArray, dir, '', domain)
  return filesArray
}

/**
 * @param dir Directory to upload the file to.
 * @param path Path to the file, relative to the directory, without the file name.
 * @param file File object to upload.
 */
export async function uploadFile(dir: Dir, path: string, file: File) {
  if (!file) return

  let target, name, buffer
  try {
    target = sanitizePath('files', dir, path)
    name = path_.basename(file.name).removeUnwantedFilenameChars()
    buffer = Buffer.from(await file.arrayBuffer())
  } catch (err) {
    console.warn('Invalid path:', path, err)
    throw new BusinessError('Invalid path', NotificationCode.INVALID_REQUEST, 400)
  }

  try {
    if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true })
    fs.writeFileSync(path_.join(target, name), buffer)
  } catch (err) {
    console.error('Error writing file:', err)
    throw new ServerError('Failed to write file', err, NotificationCode.INTERNAL_SERVER_ERROR, 500)
  }
}

/**
 * Create an empty file.
 * @param dir Directory where the file to create is.
 * @param path Path to the file, relative to the directory, without the file name.
 * @param name Name of the file to create.
 */
export function createFile(dir: Dir, path: string, name: string | undefined) {
  let target
  try {
    target = sanitizePath('files', dir, path)
  } catch (err) {
    console.warn('Invalid path:', path, err)
    throw new BusinessError('Invalid path', NotificationCode.INVALID_REQUEST, 400)
  }

  try {
    if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true })
  } catch (err) {
    console.error('Error creating directory:', err)
    throw new ServerError('Failed to create directory', err, NotificationCode.INTERNAL_SERVER_ERROR, 500)
  }

  if (name) {
    try {
      name = name.removeUnwantedFilenameChars()
      fs.writeFileSync(path_.join(target, name), '')
    } catch (err) {
      console.error('Error creating file:', err)
      throw new ServerError('Failed to create file', err, NotificationCode.INTERNAL_SERVER_ERROR, 500)
    }
  }
}

/**
 * @param dir Directory where the file to edit is.
 * @param path Path to the file, relative to the directory, without the file name.
 * @param name Name of the file to edit.
 * @param content New content for the file.
 */
export function editFile(dir: Dir, path: string, name: string, content: string) {
  let fullPath
  try {
    name = name.removeUnwantedFilenameChars()
    fullPath = sanitizePath('files', dir, path, name)
  } catch (err) {
    console.warn('Invalid path:', path, err)
    throw new BusinessError('Invalid path', NotificationCode.INVALID_REQUEST, 400)
  }

  if (!fs.existsSync(fullPath)) {
    console.warn('File does not exist:', fullPath)
    throw new BusinessError('File does not exist', NotificationCode.NOT_FOUND, 404)
  }

  try {
    fs.writeFileSync(fullPath, content)
  } catch (err) {
    console.error('Error editing file:', err)
    throw new ServerError('Failed to edit file', err, NotificationCode.INTERNAL_SERVER_ERROR, 500)
  }
}

/**
 * @param dir Directory where the file to rename is.
 * @param path Path to the file, relative to the directory, without the file name.
 * @param name Current name of the file.
 * @param newName New name of the file.
 */
export function renameFile(dir: Dir, path: string, name: string, newName: string) {
  let fullPath, newFullPath
  try {
    name = name.removeUnwantedFilenameChars()
    fullPath = sanitizePath('files', dir, path, name)
    newFullPath = sanitizePath('files', dir, path, newName)
  } catch (err) {
    console.warn('Invalid path:', path, err)
    throw new BusinessError('Invalid path', NotificationCode.INVALID_REQUEST, 400)
  }

  if (!fs.existsSync(fullPath)) {
    console.warn('File does not exist:', fullPath)
    throw new BusinessError('File does not exist', NotificationCode.NOT_FOUND, 404)
  }

  try {
    fs.renameSync(fullPath, newFullPath)
  } catch (err) {
    console.error('Error renaming file:', err)
    throw new ServerError('Failed to rename file', err, NotificationCode.INTERNAL_SERVER_ERROR, 500)
  }
}

/**
 * @param dir Directory where the file to delete is.
 * @param path Path to the file, relative to the directory, **including** the file name.
 */
export function deleteFile(dir: Dir, path: string) {
  try {
    path = sanitizePath('files', dir, path)
  } catch (err) {
    console.warn('Invalid path:', path, err)
    throw new BusinessError('Invalid path', NotificationCode.INVALID_REQUEST, 400)
  }

  if (!fs.existsSync(path)) {
    console.warn('Path does not exist:', path)
    throw new BusinessError('Path does not exist', NotificationCode.NOT_FOUND, 404)
  }

  try {
    fs.rmSync(path, { recursive: true })
  } catch (err) {
    console.error('Error deleting file:', err)
    throw new ServerError('Failed to delete file', err, NotificationCode.INTERNAL_SERVER_ERROR, 500)
  }
}

export function sanitizePath(...path: string[]): string {
  const sanitizedPath = path_.resolve(root, path_.join(...path).replace(/^\\+/, ''))
  if (!sanitizedPath.startsWith(root)) throw Error('Invalid path')
  return sanitizedPath
}

/**
 * Browse files in a directory and add them to the filesArray.
 * @param filesArray Array to store the files in.
 * @param dir Directory to browse.
 * @param subdir Subdirectory to browse.
 * @param domain Domain to use for file URLs.
 */
function browse(filesArray: File_[], dir: Dir, subdir: string, domain: string) {
  const fulldir = subdir === '' ? dir : `${dir}/${subdir}`
  if (!fs.existsSync(`${root}/files/${fulldir}`)) return

  const files = fs.readdirSync(`${root}/files/${fulldir}`)

  files.forEach((name) => {
    const path = `${subdir}/`.formatPath()
    const url = `${domain}/files/${fulldir}/${name}`.formatPath()
    const type = getType(`${root}/files/${fulldir}/${name}`)
    if (type === 'FOLDER') {
      browse(filesArray, dir, `${subdir}/${name}`.replace(/^\/+/, ''), domain)
      filesArray.push({ name, path, url, type })
    } else {
      const fileHash = fs.readFileSync(`${root}/files/${fulldir}/${name}`)
      const size = fs.statSync(`${root}/files/${fulldir}/${name}`).size
      const sha1 = crypto.createHash('sha1').update(fileHash).digest('hex')
      filesArray.push({ name, path, size, sha1, url, type })
    }
  })
}

function getType(path: string): 'FOLDER' | 'ASSET' | 'LIBRARY' | 'MOD' | 'CONFIG' | 'BOOTSTRAP' | 'BACKGROUND' | 'IMAGE' | 'OTHER' {
  if (fs.statSync(path).isDirectory()) return 'FOLDER'
  if (path.includes('assets')) return 'ASSET'
  if (path.includes('lib')) return 'LIBRARY'
  if (path.includes('mods')) return 'MOD'
  if (path.includes('config')) return 'CONFIG'
  if (path.includes('bootstraps')) return 'BOOTSTRAP'
  if (path.includes('backgrounds')) return 'BACKGROUND'
  if (path.includes('images')) return 'IMAGE'
  return 'OTHER'
}





