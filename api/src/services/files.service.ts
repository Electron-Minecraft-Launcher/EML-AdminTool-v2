import { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import fs from 'fs'
import nexter from '../utils/nexter'
import authService from './auth.service'
import { UnauthorizedException } from '../responses/exceptions/unauthorized-exception.response'
import { ServerException } from '../responses/exceptions/server-exception.response'
import { RequestException } from '../responses/exceptions/request-exception.response'
import { DefaultServiceResponse } from '../../../shared/models/responses/services/default-service-response.model'
import { ResponseType } from '../../../shared/models/types'
import { File } from '../../../shared/models/features/filesupdater.model'
import crypto from 'crypto'

class FilesService {
  private filesArray: File[] = []

  async getFilesUpdater(req: Request): Promise<File[]> {
    this.filesArray = []
    const domain = `${req.protocol}://${req.get('host')}`
    this.browse('files-updater', '', domain)
    return this.filesArray
  }

  async uploadToFilesUpdater(req: Request, res: Response, next: NextFunction) {
    try {
      nexter.serviceToException(await authService.checkAuth(req.headers['authorization'] + '', 'Bearer'))
    } catch (error) {
      next(new UnauthorizedException('Unauthorized'))
      return
    }

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const path = req.body && req.body.path ? `../files/files-updater/${req.body.path}/` : `../files/files-updater/`
        if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true })
        cb(null, path)
      },
      filename: (req, file, cb) => {
        cb(null, file.originalname)
      }
    })

    const upload = multer({ storage }).array('files')

    upload(req, res, (err) => {
      if (err) {
        next(new ServerException('Error uploading files'))
        return
      }
    })

    next()
  }

  deleteFromUpdater(path: Request): DefaultServiceResponse {
    if (!fs.existsSync(`../files/files-updater/${path}`)) return { status: false, code: ResponseType.CLIENT_ERROR, message: 'No file or folder' }

    if (fs.lstatSync(`../files/files-updater/${path}`).isFile()) fs.unlinkSync(`../files/files-updater/${path}`)
    else fs.rmdirSync(`../files/files-updater/${path}`, { recursive: true })

    return { status: true, code: ResponseType.SUCCESS }
  }

  private browse(dir: 'files-updater' | 'bootstrap', subdir: string, domain: string): void {
    if (!fs.existsSync(`../files/${dir}/${subdir}`)) return

    const files = fs.readdirSync(`../files/${dir}/${subdir}`)

    
    files.forEach((name) => {
      if (fs.statSync(`../files/${dir}/${subdir}/${name}`).isDirectory()) {
        this.browse(dir, `${subdir}/${name}`, domain)
      } else {
        console.log(`${subdir}/${name}`)
        let path = `${subdir}/${name}`.split('\\').join('/').replace(/^\/+/, '')
        let size = fs.statSync(`../files/${dir}/${subdir}/${name}`).size
        let sha1 = crypto.createHash('sha1').update(`../files/${dir}/${subdir}/${name}`).digest('hex')
        let url = `${domain}/files/${path}/${subdir}/${name}`
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
