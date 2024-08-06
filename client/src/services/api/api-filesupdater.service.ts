import http from '../http.module'
import type { DataHttpResponse } from '../../../../shared/types/responses/http/data-http-response'
import type { DefaultHttpResponse } from '../../../../shared/types/responses/http/default-http-response'
import type { EMLAdminToolInfo } from '../../../../shared/types/features/emlat-info'
import type { User } from '../../../../shared/types/features/user'
import type {
  File as File_,
  ForgeManifest,
  ForgePromotions,
  Loader,
  LoaderVersion,
  MinecraftManifest
} from '../../../../shared/types/features/file'

class ApiFilesUpdaterService {
  async getFilesUpdater() {
    return await http.get<DataHttpResponse<File_[]>>('/api/files-updater')
  }

  async uploadFiles(path: string, files: File[]) {
    let body = new FormData()
    body.set('path', path)
    for (let i = 0; i < files.length; i++) {
      body.append('files[]', files[i])
    }
    return await http.post<DataHttpResponse<File_[]>>('/api/files-updater', body)
  }

  async renameFile(old_path: string, new_path: string) {
    return await http.put<DataHttpResponse<File_[]>>('/api/files-updater', { old_path, new_path })
  }

  async deleteFiles(paths: string[]) {
    return await http.delete<DataHttpResponse<File_[]>>('/api/files-updater', { paths: JSON.stringify(paths) })
  }

  async getLoader() {
    return await http.get<DataHttpResponse<Loader>>('/api/files-updater/loader')
  }

  async putLoader(loader: Loader) {
    return await http.put<DataHttpResponse<Loader>>('/api/files-updater/loader', loader)
  }

  async getMinecraftVersions(): Promise<LoaderVersion[]> {
    const res: MinecraftManifest = await fetch('https://piston-meta.mojang.com/mc/game/version_manifest.json')
      .then((res) => res.json())
      .catch((err) => err)

    let versions: LoaderVersion[] = [
      { minecraftVersion: 'Latest', loaderVersion: 'latest_release', type: ['release'] },
      { minecraftVersion: 'Latest', loaderVersion: 'latest_snapshot', type: ['snapshot'] }
    ]
    let release = 'Latest'
    for (const version of res.versions) {
      if (version.type === 'release') release = version.id.split('.').slice(0, 2).join('.')
      versions.push({
        minecraftVersion: release,
        loaderVersion: version.id,
        type: [version.type]
      })
    }
    
    return versions
  }

  async getForgeVersions() {
    const res1: ForgeManifest = await fetch('https://files.minecraftforge.net/net/minecraftforge/forge/maven-metadata.json')
      .then((res) => res.json())
      .catch((err) => err)

    const res2: ForgePromotions = await fetch('https://files.minecraftforge.net/maven/net/minecraftforge/forge/promotions_slim.json')
      .then((res) => res.json())
      .catch((err) => err)
    let versions: LoaderVersion[] = []
    for (const [version, data] of Object.entries(res1)) {
      versions.push(
        ...data.map((v) => ({ minecraftVersion: version.split('.').slice(0, 2).join('.'), loaderVersion: v, type: ['default' as 'default'] }))
      )
    }
    for (const [version, data] of Object.entries(res2.promos)) {
      const minecraftVersion = version.split('-')[0]
      const type = version.split('-')[1] as 'recommended' | 'latest'
      const i = versions.findIndex((v) => v.loaderVersion.startsWith(`${minecraftVersion}-${data}`))
      versions[i].type =
        (versions[i].type.includes('recommended') || versions[i].type.includes('latest')) && !versions[i].type.includes(type)
          ? ['latest', 'recommended']
          : [type]
    }

    return versions.reverse()
  }
}

export default new ApiFilesUpdaterService()
