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
    const defaultResponse = new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', { loader: 'vanilla', minecraft_version: 'latest_release', loader_version: null, loader_type: 'client' } as Loader)

    let loader: Loader

    try {
      loader = (await db.query<Loader[]>('SELECT * FROM loader'))[0]
    } catch (error) {
      throw new DBException()
    }

    if (!loader || !loader.id) return defaultResponse

    delete loader.id

    loader = { ...loader, file: JSON.parse(loader.file as string) }

    return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', loader)
  }

  async putLoader(req: Request, headers: IncomingHttpHeaders, body: Loader): Promise<DataSuccess<Loader>> {
    try {
      var auth = nexter.serviceToException(await authService.checkAuth(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    if (+auth.p_files_updater_loader_mod! != 1) throw new UnauthorizedException()

    if (!body.loader || !body.minecraft_version || !body.loader_version) throw new RequestException('Missing parameters')

    if (body.loader !== 'vanilla' && body.loader !== 'forge') throw new RequestException('Invalid parameters')

    body = { ...body, loader_type: 'client' }

    if (body.loader === 'vanilla') {
      body.loader_version = null

      if (body.minecraft_version !== 'latest_release' && body.minecraft_version !== 'latest_snapshot') {
        const minecraftVersions = await this.getMinecraftVersions()

        console.log(body.minecraft_version)

        if (!(minecraftVersions.versions as { id: string, type: string }[]).find(v => v.id === body.minecraft_version)) {
          throw new RequestException('Invalid parameters')
        }
      }
    } else if (body.loader === 'forge') {
      if (body.loader_version!.split('-')[0] !== body.minecraft_version) throw new RequestException('Invalid parameters')

      const forgeVersions = await this.getForgeVersions()

      if (!Object.keys(forgeVersions).includes(body.minecraft_version) || !forgeVersions[body.minecraft_version].includes(body.loader_version)) {
        throw new RequestException('Invalid parameters')
      }

      body.loader_type = +body.minecraft_version.split('.')[1] >= 13 ? 'installer' : +body.minecraft_version.split('.')[1] >= 3 ? 'universal' : 'client'

      const forgeMeta = (await this.getForgeMeta(body.loader_version!)).classifiers

      const ext = Object.keys(forgeMeta[body.loader_type])[0]

      const size = +(await this.getForgeArtifactSize(body.loader_version!, body.loader_type, ext))
      const sha1 = await this.getForgeArtifactSha1(body.loader_version!, body.loader_type, ext)
      body = {
        ...body,
        file: {
          name: `forge-${body.loader_version}-${body.loader_type}.${ext}`,
          path: '',
          url: `https://maven.minecraftforge.net/net/minecraftforge/forge/${body.loader_version}/forge-${body.loader_version}-${body.loader_type}.${ext}`,
          size: size,
          sha1: sha1,
          type: 'LIBRARY',
        }
      }
    } // TODO other loaders

    try {
      await db.query('DELETE FROM loader')
      await db.query('INSERT INTO loader (loader, minecraft_version, loader_version, loader_type, file) VALUES (?, ?, ?, ?, ?)', [
        body.loader,
        body.minecraft_version,
        body.loader_version,
        body.loader_type,
        JSON.stringify(body.file)
      ])
    } catch (error) {
      throw new DBException()
    }

    return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', body)
  }

  private async getMinecraftVersions() {
    return await fetch(`https://launchermeta.mojang.com/mc/game/version_manifest.json`)
      .then((res) => res.json())
      .catch(() => {
        throw new ServerException('Error fetching Minecraft versions')
      })
  }

  private async getForgeVersions() {
    return await fetch(`https://files.minecraftforge.net/net/minecraftforge/forge/maven-metadata.json`)
      .then((res) => res.json())
      .catch(() => {
        throw new ServerException('Error fetching Forge versions')
      })
  }

  private async getForgeMeta(version: string) {
    return await fetch(`https://files.minecraftforge.net/net/minecraftforge/forge/${version}/meta.json`)
      .then((res) => res.json())
      .catch(() => {
        throw new ServerException('Error fetching Forge meta')
      })
  }

  private async getForgeArtifactSize(version: string, loaderType: 'installer' | 'universal' | 'client', ext: string) {
    return await fetch(`https://maven.minecraftforge.net/net/minecraftforge/forge/${version}/forge-${version}-${loaderType}.${ext}`)
      .then((res) => res.headers.get('Content-Length') || 0)
      .catch(() => {
        throw new ServerException('Error fetching Forge artifact')
      })
  }

  private async getForgeArtifactSha1(version: string, loaderType: 'installer' | 'universal' | 'client', ext: string) {
    return await fetch(`https://maven.minecraftforge.net/net/minecraftforge/forge/${version}/forge-${version}-${loaderType}.${ext}.sha1`)
      .then((res) => res.text())
      .catch(() => {
        throw new ServerException('Error fetching Forge artifact')
      })
  }
}

export default FilesUpdater
