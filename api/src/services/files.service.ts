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
import multiparty from 'multiparty'

class FilesService {
  private filesArray: File[] = []

  async get(req: Request, dir: 'files-updater' | 'bootstrap' | 'background'): Promise<File[]> {
    this.filesArray = []
    const domain = `${req.protocol}://${req.get('host')}`
    this.browse(dir, '', domain)
    return this.filesArray
  }

  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      var user = nexter.serviceToException(await authService.checkAuth(req.headers['authorization'] + '', 'Bearer'))
    } catch (error) {
      next(new UnauthorizedException('Unauthorized'))
      return
    }

    const action = req.path.split('/')[2]

    if (action === 'files-updater') {
      if (+user.p_files_updater_add_del! != 1) {
        next(new UnauthorizedException('Unauthorized'))
        return
      }
    } else if (action === 'bootstrap') {
      if (+user.p_bootstrap_mod! != 1) {
        next(new UnauthorizedException('Unauthorized'))
        return
      }
    } else if (action === 'background') {
      if (+user.p_background_mod! != 1) {
        next(new UnauthorizedException('Unauthorized'))
        return
      }
    } else {
      next(new RequestException('Invalid request'))
      return
    }

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const filepath = file.originalname.split('/').slice(0, -1).join('/')
        const path = req.body && req.body.path ? `../files/${action}/${req.body.path}/${filepath}/` : `../files/${action}/${filepath}/`
        if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true })
        cb(null, path)
      },
      filename: (req, file, cb) => {
        cb(null, file.originalname.split('/').slice(-1)[0])
      }
    })

    multer({ storage, preservePath: true }).array('files[]')(req, res, (err) => {
      if (err) {
        console.log(err)
        next(new ServerException('Error uploading files'))
        return
      }
      next()
    })
  }

  delete(dir: 'files-updater' | 'bootstrap' | 'background', path: Request): DefaultServiceResponse {
    if (!fs.existsSync(`../files/${dir}/${path}`)) return { status: false, code: ResponseType.CLIENT_ERROR, message: 'No file or folder' }

    if (fs.lstatSync(`../files/${dir}/${path}`).isFile()) fs.unlinkSync(`../files/${dir}/${path}`)
    else fs.rmdirSync(`../files/${dir}/${path}`, { recursive: true })

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

interface MultipartFile {
  fieldname: string
  originalFilename: string
  path: string
  headers: any
  size: number
}

export default new FilesService()
