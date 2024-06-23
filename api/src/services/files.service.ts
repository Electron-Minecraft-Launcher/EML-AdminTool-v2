import { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import fs from 'fs'
import nexter from '../utils/nexter'
import authService from './auth.service'
import { UnauthorizedException } from '../responses/exceptions/unauthorized-exception.response'
import { ServerException } from '../responses/exceptions/server-exception.response'
import { DefaultServiceResponse } from '../../../shared/models/responses/services/default-service-response.model'
import { ResponseType } from '../../../shared/models/types'
import { File } from '../../../shared/models/features/filesupdater.model'
import crypto from 'crypto'
import { RequestException } from '../responses/exceptions/request-exception.response'

class FilesService {
  private filesArray: File[] = []

  async get(req: Request, dir: 'files-updater' | 'bootstrap' | 'background'): Promise<File[]> {
    this.filesArray = []
    const domain = `${req.protocol}://${req.get('host')}`
    this.browse(dir, '', domain)
    return this.filesArray
  }

  rename(dir: 'files-updater' | 'bootstrap' | 'background', oldPath: string, newPath: string): DefaultServiceResponse {
    if (!fs.existsSync(`../files/${dir}/${oldPath}`)) return { status: false, code: ResponseType.CLIENT_ERROR, message: 'No file or folder' }
    if (
      oldPath.includes('../') ||
      oldPath.includes('..\\') ||
      oldPath === '..' ||
      newPath.includes('../') ||
      newPath.includes('..\\') ||
      newPath === '..'
    )
      return { status: false, code: ResponseType.CLIENT_ERROR, message: 'Invalid path' }

    fs.renameSync(`../files/${dir}/${oldPath}`, `../files/${dir}/${newPath}`)
    return { status: true, code: ResponseType.SUCCESS }
  }

  delete(dir: 'files-updater' | 'bootstrap' | 'background', paths: string[]): DefaultServiceResponse {
    paths.forEach((path) => {
      if (!fs.existsSync(`../files/${dir}/${path}`)) return { status: false, code: ResponseType.CLIENT_ERROR, message: 'No file or folder' }
      if (path.includes('../') || path.includes('..\\') || path === '..')
        return { status: false, code: ResponseType.CLIENT_ERROR, message: 'Invalid path' }

      if (fs.lstatSync(`../files/${dir}/${path}`).isFile()) fs.unlinkSync(`../files/${dir}/${path}`)
      else fs.rmdirSync(`../files/${dir}/${path}`, { recursive: true })
    })

    return { status: true, code: ResponseType.SUCCESS }
  }

  private browse(dir: 'files-updater' | 'bootstrap' | 'background', subdir: string, domain: string): void {
    const fulldir = subdir === '' ? dir : `${dir}/${subdir}`
    if (!fs.existsSync(`../files/${fulldir}`)) return

    const files = fs.readdirSync(`../files/${fulldir}`)

    files.forEach((name) => {
      if (fs.statSync(`../files/${fulldir}/${name}`).isDirectory()) {
        this.browse(dir, `${subdir}/${name}`.replace(/^\/+/, ''), domain)
      } else {
        let path = `${subdir}/`.split('\\').join('/').replace(/^\/+/, '')
        let size = fs.statSync(`../files/${fulldir}/${name}`).size
        let sha1 = crypto.createHash('sha1').update(`../files/${fulldir}/${name}`).digest('hex')
        let url = `${domain}/files/${fulldir}/${name}`.split('\\').join('/').replace(/^\/+/, '')
        let type: 'ASSETS' | 'LIBRARIES' | 'MODS' | 'CONFIG' | 'JAVA' | 'NATIVES' | 'OTHER' = path.includes('assets')
          ? 'ASSETS'
          : path.includes('lib')
            ? 'LIBRARIES'
            : path.includes('mods')
              ? 'MODS'
              : path.includes('config')
                ? 'CONFIG'
                : 'MODS'
        this.filesArray.push({ name, path, size, sha1, url, type })
      }
    })
  }
}

export default new FilesService()
