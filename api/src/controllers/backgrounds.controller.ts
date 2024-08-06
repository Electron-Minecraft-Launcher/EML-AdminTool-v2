import { Request } from 'express'
import { DataSuccess } from '../responses/success/data-success.response'
import { ResponseType, count } from '../../../shared/types/types'
import { File } from '../../../shared/types/features/file'
import filesService from '../services/files.service'
import { IncomingHttpHeaders } from 'http'
import nexter from '../utils/nexter'
import authService from '../services/auth.service'
import { ServiceException } from '../responses/types'
import { UnauthorizedException } from '../responses/exceptions/unauthorized-exception.response'
import { RequestException } from '../responses/exceptions/request-exception.response'
import db from '../utils/db'
import { DBException } from '../responses/exceptions/db-exception.response'
import { Background, BackgroundsRes } from '../../../shared/types/features/background'
import { NotFoundException } from '../responses/exceptions/notfound-exception.response'

class Backgrounds {
  async getBackgrounds(req: Request): Promise<DataSuccess<BackgroundsRes[]>> {
    let backgroundsRes: BackgroundsRes[] = []

    const backgroundsFiles = await filesService.get(req, 'backgrounds')

    let backgrounds: Background[]

    try {
      backgrounds = await db.query<Background[]>('SELECT * FROM backgrounds')
    } catch (error: any) {
      throw new DBException()
    }

    if (backgroundsFiles.some((file) => backgrounds.some((background) => background.path === file.name))) {
      backgroundsRes = backgroundsFiles
        .filter((file) => backgrounds.some((background) => background.path === file.name))
        .map((file) => {
          const background = backgrounds.find((background) => background.path === file.name)
          return {
            ...file,
            title: background!.title,
            status: background!.status,
            id: background!.id
          }
        })
    }

    return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', backgroundsRes)
  }

  async getBackground(req: Request<any>, backgroundId: number): Promise<DataSuccess<BackgroundsRes>> {
    let backgroundRes: BackgroundsRes = {
      name: '',
      path: '',
      title: '',
      status: 0,
      url: '',
      sha1: '',
      size: 0,
      type: 'BACKGROUND'
    }

    const backgroundsFiles = await filesService.get(req, 'backgrounds')

    let background: Background

    try {
      background = (await db.query<Background[]>('SELECT * FROM backgrounds WHERE id = ?', [backgroundId]))[0]
    } catch (error: any) {
      throw new DBException(error)
    }

    if (!background || !background.id) {
      throw new NotFoundException('Background not found')
    }

    if (backgroundsFiles.find((file) => file.name === background.path)) {
      backgroundRes = {
        ...backgroundsFiles.find((file) => file.name === background.path)!,
        title: background.title,
        status: background.status
      }
    }

    return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', backgroundRes)
  }

  async uploadBackground(req: Request, body: any): Promise<DataSuccess<BackgroundsRes[]>> {
    if (!req.file || !req.file.filename) {
      throw new RequestException('Missing file')
    }

    try {
      await db.query('INSERT INTO backgrounds (title, path, status) VALUES (?, ?, ?)', [
        body.title,
        req.file.filename,
        body.status == 'true' || body.status == 1 ? 1 : 0
      ])
    } catch (error) {
      throw new DBException()
    }

    if (body.status == 'true' || body.status == 1) {
      try {
        await db.query('UPDATE backgrounds SET status = 0 WHERE path != ?', [req.file.filename])
      } catch (error) {
        throw new DBException()
      }
    }

    return await this.getBackgrounds(req)
  }

  async putActiveBackground(req: Request, headers: IncomingHttpHeaders, body: any): Promise<DataSuccess<BackgroundsRes[]>> {
    try {
      var auth = nexter.serviceToException(await authService.checkAuth(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    if (+auth.p_background_mod! != 1) {
      throw new UnauthorizedException()
    }

    if (!body.background_id) {
      throw new RequestException('Missing parameters')
    }

    let countBackground: count

    try {
      countBackground = (await db.query<count[]>('SELECT COUNT(*) AS count FROM backgrounds WHERE id = ?', [body.background_id]))[0]
    } catch (error: any) {
      throw new DBException()
    }

    if (countBackground.count === 0) {
      throw new NotFoundException('Background not found')
    }

    try {
      await db.query('UPDATE backgrounds SET status = 0')
      await db.query('UPDATE backgrounds SET status = 1 WHERE id = ?', [body.background_id])
    } catch (error: any) {
      throw new DBException()
    }

    return await this.getBackgrounds(req)
  }

  async putBackgroundTitle(req: Request<any>, headers: IncomingHttpHeaders, body: any, backgroundId: number): Promise<DataSuccess<BackgroundsRes[]>> {
    try {
      var auth = nexter.serviceToException(await authService.checkAuth(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    if (+auth.p_background_mod! != 1) {
      throw new UnauthorizedException()
    }

    if (!backgroundId || !body.title) {
      throw new RequestException('Missing parameters')
    }

    let countBackground: count

    try {
      countBackground = (await db.query<count[]>('SELECT COUNT(*) AS count FROM backgrounds WHERE id = ?', [backgroundId]))[0]
    } catch (error: any) {
      throw new DBException()
    }

    if (countBackground.count === 0) {
      throw new NotFoundException('Background not found')
    }

    try {
      await db.query('UPDATE backgrounds SET title = ? WHERE id = ?', [body.title, backgroundId])
    } catch (error: any) {
      throw new DBException()
    }

    return await this.getBackgrounds(req)
  }

  async deleteBackground(req: Request<any>, headers: IncomingHttpHeaders, backgroundId: number): Promise<DataSuccess<BackgroundsRes[]>> {
    try {
      var auth = nexter.serviceToException(await authService.checkAuth(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    if (!backgroundId) {
      throw new RequestException('Missing parameters')
    }

    if (+auth.p_background_mod! != 1) {
      throw new UnauthorizedException()
    }

    let background: Background

    try {
      background = (await db.query<Background[]>('SELECT * FROM backgrounds WHERE id = ?', [backgroundId]))[0]
    } catch (error: any) {
      throw new DBException()
    }

    if (!background || background.id === 0) {
      throw new NotFoundException('Background not found')
    }

    if (background.status === 1) {
      throw new RequestException('Cannot delete active background')
    }

    try {
      await db.query('DELETE FROM backgrounds WHERE id = ?', [backgroundId])
    } catch (error: any) {
      throw new DBException()
    }

    const r = filesService.delete('backgrounds', [background.path + ''])
    if (r.status) {
      return await this.getBackgrounds(req)
    } else {
      throw new RequestException(r.message || 'Error deleting file')
    }
  }
}

export default Backgrounds
