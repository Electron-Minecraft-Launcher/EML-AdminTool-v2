import { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import fs from 'fs'
import nexter from '../utils/nexter'
import authService from './auth.service'
import { UnauthorizedException } from '../responses/exceptions/unauthorized-exception.response'
import { ServerException } from '../responses/exceptions/server-exception.response'
import { DefaultServiceResponse } from '../../../shared/types/responses/services/default-service-response'
import { ResponseType } from '../../../shared/types/types'
import { File } from '../../../shared/types/features/file'
import crypto from 'crypto'
import { RequestException } from '../responses/exceptions/request-exception.response'
import path_ from 'path'

class FilesService {
  private filesArray: File[] = []

  async get(req: Request, dir: 'files-updater' | 'bootstraps' | 'backgrounds' | 'images'): Promise<File[]> {
    this.filesArray = []
    const domain = `${req.protocol}://${req.get('host')}`
    this.browse(dir, '', domain)
    return this.filesArray
  }

  rename(dir: 'files-updater' | 'bootstraps' | 'backgrounds' | 'images', oldPath: string, newPath: string): DefaultServiceResponse {
    try {
      oldPath = this.sanitize('files', dir, oldPath)
      newPath = this.sanitize('files', dir, newPath)
    } catch (error) {
      return { status: false, code: ResponseType.CLIENT_ERROR, message: 'Invalid path' }
    }

    if (!fs.existsSync(oldPath)) {
      return { status: false, code: ResponseType.CLIENT_ERROR, message: 'No file or folder' }
    }

    fs.renameSync(oldPath, newPath)

    return { status: true, code: ResponseType.SUCCESS }
  }

  delete(dir: 'files-updater' | 'bootstraps' | 'backgrounds' | 'images', paths: string[]): DefaultServiceResponse {
    paths.forEach((path) => {
      try {
        path = this.sanitize('files', dir, path)
      } catch (error) {
        return { status: false, code: ResponseType.CLIENT_ERROR, message: 'Invalid path' }
      }

      if (!fs.existsSync(path)) {
        return { status: false, code: ResponseType.CLIENT_ERROR, message: 'No file or folder' }
      }

      fs.rmSync(path, { recursive: true })
    })

    return { status: true, code: ResponseType.SUCCESS }
  }

  /**
   * @param path The path to sanitize (relative to the **app root**).
   */
  sanitize(...path: string[]): string {
    const root = path_.join(process.cwd(), this.cwd())
    const p = path_.join(...path).replace(/^\\+/, '')
    const sanitizedPath = path_.resolve(root, p)
    if (!sanitizedPath.startsWith(root)) {
      throw 'Invalid path'
    }
    return sanitizedPath
  }
  
  cwd() {
    if (process.cwd().includes('api')) return '..'
    return '.'
  }

  private browse(dir: 'files-updater' | 'bootstraps' | 'backgrounds' | 'images', subdir: string, domain: string): void {
    const fulldir = subdir === '' ? dir : `${dir}/${subdir}`
    if (!fs.existsSync(`${this.cwd()}/files/${fulldir}`)) return

    const files = fs.readdirSync(`${this.cwd()}/files/${fulldir}`)

    files.forEach((name) => {
      if (fs.statSync(`${this.cwd()}/files/${fulldir}/${name}`).isDirectory()) {
        this.browse(dir, `${subdir}/${name}`.replace(/^\/+/, ''), domain)
        this.filesArray.push({
          name,
          path: `${subdir}/`.split('\\').join('/').replace(/^\/+/, ''),
          url: `${domain}/files/${fulldir}/${name}`.split('\\').join('/').replace(/^\/+/, ''),
          type: 'FOLDER'
        })
      } else {
        const fileHash = fs.readFileSync(`${this.cwd()}/files/${fulldir}/${name}`)
        let path = `${subdir}/`.split('\\').join('/').replace(/^\/+/, '')
        let size = fs.statSync(`${this.cwd()}/files/${fulldir}/${name}`).size
        let sha1 = crypto.createHash('sha1').update(fileHash).digest('hex')
        let url = `${domain}/files/${fulldir}/${name}`.split('\\').join('/').replace(/^\/+/, '')
        let type: 'ASSET' | 'LIBRARY' | 'MOD' | 'CONFIG' | 'JAVA' | 'NATIVE' | 'BOOTSTRAP' | 'BACKGROUND' | 'IMAGE' | 'OTHER' = path.includes(
          'assets'
        )
          ? 'ASSET'
          : path.includes('lib')
            ? 'LIBRARY'
            : path.includes('mods')
              ? 'MOD'
              : path.includes('config')
                ? 'CONFIG'
                : dir === 'bootstraps'
                  ? 'BOOTSTRAP'
                  : dir === 'backgrounds'
                    ? 'BACKGROUND'
                    : dir === 'images'
                      ? 'IMAGE'
                      : 'OTHER'
        this.filesArray.push({ name, path, size, sha1, url, type })
      }
    })
  }
}

export default new FilesService()
