import { Request, Response, NextFunction } from 'express'
import nexter from '../utils/nexter'
import authService from '../services/auth.service'
import { UnauthorizedException } from '../responses/exceptions/unauthorized-exception.response'
import multer from 'multer'
import { RequestException } from '../responses/exceptions/request-exception.response'
import fs from 'fs'
import { ServerException } from '../responses/exceptions/server-exception.response'
import crypto from 'crypto'
import filesService from '../services/files.service'

const middleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    var auth = nexter.serviceToException(await authService.checkAuth(req.headers['authorization'] + '', 'Bearer'))
  } catch (error) {
    next(new UnauthorizedException('Unauthorized'))
    return
  }

  if (+auth.p_background_mod! != 1) {
    next(new UnauthorizedException('Unauthorized'))
    return
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (!req.body || !req.body.title) {
        next(new RequestException('Missing parameters'))
        return
      }

      const path = `${filesService.cwd()}/files/backgrounds`
      if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true })
      cb(null, path)
    },
    filename: (req, file, cb) => {
      const filename = `${new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14)}_${crypto.randomBytes(5).toString('hex')}`
      const fileExt = file.originalname.split('.').slice(-1)[0]
      cb(null, `${filename}.${fileExt}`)
    }
  })

  multer({ storage }).single('file')(req, res, (err) => {
    if (err) {
      next(new ServerException('Error uploading file'))
      return
    }
    next()
  })
}

export default middleware
