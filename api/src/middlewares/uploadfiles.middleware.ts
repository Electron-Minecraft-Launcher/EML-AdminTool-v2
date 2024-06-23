import { Request, Response, NextFunction } from 'express'
import nexter from '../utils/nexter'
import authService from '../services/auth.service'
import { UnauthorizedException } from '../responses/exceptions/unauthorized-exception.response'
import multer from 'multer'
import { RequestException } from '../responses/exceptions/request-exception.response'
import fs from 'fs'
import { ServerException } from '../responses/exceptions/server-exception.response'

const middleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    var auth = nexter.serviceToException(await authService.checkAuth(req.headers['authorization'] + '', 'Bearer'))
  } catch (error) {
    next(new UnauthorizedException('Unauthorized'))
    return
  }

  const action = req.path.split('/')[2]

  if (action === 'files-updater') {
    if (+auth.p_files_updater_add_del! != 1) {
      next(new UnauthorizedException('Unauthorized'))
      return
    }
  } else if (action === 'bootstrap') {
    if (+auth.p_bootstrap_mod! != 1) {
      next(new UnauthorizedException('Unauthorized'))
      return
    }
  } else if (action === 'background') {
    if (+auth.p_background_mod! != 1) {
      next(new UnauthorizedException('Unauthorized'))
      return
    }
  } else {
    next(new RequestException('Invalid request'))
    return
  }

  if (req.body && req.body.path && (req.body.path.includes('../') || req.body.path.includes('..\\') || req.body.path === '..')) {
    next(new RequestException('Invalid path'))
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

export default middleware