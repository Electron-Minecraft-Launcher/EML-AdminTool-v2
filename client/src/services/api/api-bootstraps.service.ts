import http from '../http.module'
import type { DataHttpResponse } from '../../../../shared/models/responses/http/data-http-response.model'
import type { File as File_ } from '../../../../shared/models/features/file.model'
import type { BootstrapsRes } from '../../../../shared/models/features/bootstraps.model'

class ApiFilesUpdaterService {
  async getBootstraps() {
    return await http.get<DataHttpResponse<BootstrapsRes>>('/api/bootstraps')
  }

  async uploadBootstrap(version: string, platform: string, file: File) {
    let body = new FormData()
    body.set('version', version)
    body.set('platform', platform)
    body.append('file', file)
    return await http.post<DataHttpResponse<BootstrapsRes>>('/api/bootstraps', body)
  }

  async deleteFiles(platform: string) {
    return await http.delete<DataHttpResponse<BootstrapsRes>>('/api/bootstraps', { platform })
  }
}

export default new ApiFilesUpdaterService()
