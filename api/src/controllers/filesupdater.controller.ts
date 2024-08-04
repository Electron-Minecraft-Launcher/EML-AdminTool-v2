import { Request } from 'express'
import { DataSuccess } from '../responses/success/data-success.response'
import envService from '../services/env.service'
import { ResponseType } from '../../../shared/models/types'
import { File, Loader } from '../../../shared/models/features/file.model'
import filesService from '../services/files.service'
import { IncomingHttpHeaders } from 'http'
import nexter from '../utils/nexter'
import authService from '../services/auth.service'
import { ServiceException } from '../responses/types'
import { UnauthorizedException } from '../responses/exceptions/unauthorized-exception.response'
import { RequestException } from '../responses/exceptions/request-exception.response'
import fs from 'fs'
import db from '../utils/db'
import { DBException } from '../responses/exceptions/db-exception.response'
import { ServerException } from '../responses/exceptions/server-exception.response'

class FilesUpdater {
  async getFilesUpdater(req: Request): Promise<DataSuccess<File[]>> {
    return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', await filesService.get(req, 'files-updater'))
  }

  async uploadFiles(req: Request): Promise<DataSuccess<File[]>> {
    const basePath =
      req.body && req.body.path ? `${filesService.cwd()}/files/files-updater/${req.body.path}/` : `${filesService.cwd()}/files/files-updater/`

    if (!fs.existsSync(basePath)) fs.mkdirSync(basePath, { recursive: true })

    return await this.getFilesUpdater(req)
  }

  async putRenameFile(req: Request, headers: IncomingHttpHeaders, body: any): Promise<DataSuccess<File[]>> {
    try {
      var auth = nexter.serviceToException(await authService.checkAuth(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    if (+auth.p_files_updater_add_del! != 1) {
      throw new UnauthorizedException()
    }

    if (!body.old_path || body.old_path == '' || !body.new_path || body.new_path == '') {
      throw new RequestException('Missing parameters')
    }

    const r = filesService.rename('files-updater', body.old_path, body.new_path)
    if (r.status) {
      return await this.getFilesUpdater(req)
    } else {
      throw new RequestException(r.message || 'Error renaming file')
    }
  }

  async deleteFiles(req: Request, headers: IncomingHttpHeaders, body: any): Promise<DataSuccess<File[]>> {
    try {
      var auth = nexter.serviceToException(await authService.checkAuth(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    if (+auth.p_files_updater_add_del! != 1) {
      throw new UnauthorizedException()
    }

    if (!body.paths) {
      throw new RequestException('Missing parameters')
    }

    try {
      body.paths = JSON.parse(body.paths)
    } catch (error) {
      throw new RequestException('Invalid parameters')
    }

    if (body.paths.length == 0) {
      throw new RequestException('Missing parameters')
    }

    body.paths.forEach((path: string) => {
      if (path + '' === '') {
        throw new RequestException('Invalid parameters')
      }
    })

    const r = filesService.delete('files-updater', body.paths)
    if (r.status) {
      return await this.getFilesUpdater(req)
    } else {
      throw new RequestException(r.message || 'Error deleting file')
    }
  }

  async getLoader(req: Request): Promise<DataSuccess<Loader>> {
    let loader: Loader

    try {
      loader = (await db.query<Loader[]>('SELECT * FROM loader'))[0]
    } catch (error) {
      throw new DBException()
    }

    if (!loader || loader.id) {
      return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', { loader: 'vanilla', version: 'latest_release', type: 'client' })
    }

    delete loader.id

    if (loader.loader === 'forge') {
      const mcVersion = loader.version.split('-')[0]
      const forgeVersion = loader.version.split('-')[1]

      const res1 = await fetch(`https://files.minecraftforge.net/net/minecraftforge/forge/maven-metadata.json`)
        .then((res) => res.json())
        .catch(() => {
          throw new ServerException('Error fetching Forge versions')
        })

      if (!Object.keys(res1).includes(mcVersion) || !res1[mcVersion].includes(loader.version)) {
        return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', { loader: 'vanilla', version: 'latest_release', type: 'client' })
      }

      return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', loader)
    } // TODO other loaders

    if (loader.version === 'latest_release' || loader.version === 'latest_snapshot') {
      return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', loader)
    }

    const res = await fetch(`https://launchermeta.mojang.com/mc/game/version_manifest.json`)
      .then((res) => res.json())
      .catch(() => {
        throw new ServerException('Error fetching Minecraft versions')
      })

    if ((res.versions as { id: string, type: string }[]).find(v => v.id === loader.version)) {
      return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', loader)
    } else {
      return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', { loader: 'vanilla', version: 'latest_release', type: 'client' })
    }
  }

  async putLoader(req: Request, headers: IncomingHttpHeaders, body: any): Promise<DataSuccess<Loader>> {
    try {
      var auth = nexter.serviceToException(await authService.checkAuth(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    if (+auth.p_files_updater_loader_mod! != 1) {
      throw new UnauthorizedException()
    }

    if (!body.loader || !body.version) {
      throw new RequestException('Missing parameters')
    }

    if (body.loader !== 'vanilla' && body.loader !== 'forge') {
      throw new RequestException('Invalid parameters')
    }

    body = { ...body, type: 'client' }

    if (body.loader === 'vanilla') {
      body.type = 'client'

      if (body.version !== 'latest_release' && body.version !== 'latest_snapshot') {
        const res = await fetch(`https://launchermeta.mojang.com/mc/game/version_manifest.json`)
          .then((res) => res.json())
          .catch(() => {
            throw new ServerException('Error fetching Minecraft versions')
          })

        if (!(res.versions as { id: string, type: string }[]).find(v => v.id === body.version)) {
          throw new RequestException('Invalid parameters')
        }
      }
    } else if (body.loader === 'forge') {
      const mcVersion = body.version.split('-')[0] || ''
      const forgeVersion = body.version.split('-')[1] || ''

      const res1 = await fetch(`https://files.minecraftforge.net/net/minecraftforge/forge/maven-metadata.json`)
        .then((res) => res.json())
        .catch(() => {
          throw new ServerException('Error fetching Forge versions')
        })

        if (!Object.keys(res1).includes(mcVersion) || !res1[mcVersion].includes(body.version)) {
          throw new RequestException('Invalid parameters')
        }


      if (+mcVersion.split('.')[1] >= 13) {
        body.type = 'installer'
      } else if (+mcVersion.split('.')[1] >= 3) {
        body.type = 'universal'
      } else {
        body.type = 'client'
      }
    } // TODO other loaders

    try {
      await db.query('DELETE FROM loader')
      await db.query('INSERT INTO loader (loader, version, type) VALUES (?, ?, ?)', [
        body.loader,
        body.version,
        body.type
      ])
    } catch (error) {
      throw new DBException()
    }

    return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', body)
  }
}

export default FilesUpdater
