import { Request, Response, NextFunction } from 'express'
import nexter from '../utils/nexter'
import authService from '../services/auth.service'
import { UnauthorizedException } from '../responses/exceptions/unauthorized-exception.response'
import multer from 'multer'
import { RequestException } from '../responses/exceptions/request-exception.response'
import fs from 'fs'
import { ServerException } from '../responses/exceptions/server-exception.response'
import envService from '../services/env.service'

const middleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    var auth = nexter.serviceToException(await authService.checkAuth(req.headers['authorization'] + '', 'Bearer'))
  } catch (error) {
    next(new UnauthorizedException('Unauthorized'))
    return
  }

  if (+auth.p_bootstraps_mod! != 1) {
    next(new UnauthorizedException('Unauthorized'))
    return
  }

  const env = await envService.getEnv()

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (!req.body || !req.body.platform || !req.body.version) {
        next(new RequestException('Missing parameters'))
        return
      }

      if (req.body.platform === 'win' || req.body.platform === 'mac' || req.body.platform === 'lin') {
        if (fs.existsSync(`../files/bootstraps/${req.body.platform}`)) fs.rmSync(`../files/bootstraps/${req.body.platform}`, { recursive: true })
      } else {
        next(new RequestException('Invalid parameters'))
        return
      }

       if (!/(\d\.\d\.\d)(-[a-z]*(\.\d)?)?/gi.test(req.body.version)) {
         next(new RequestException('Invalid parameters'))
         return
       }

      const path = `../files/bootstraps/${req.body.platform}`
      if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true })
      cb(null, path)
    },
    filename: (req, file, cb) => {
      const filename = `${env.name.toLowerCase()}_${req.body.version}_${req.body.platform}`
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
