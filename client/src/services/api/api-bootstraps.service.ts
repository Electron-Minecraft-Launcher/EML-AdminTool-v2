import http from '../http.module'
import type { DataHttpResponse } from '../../../../shared/types/responses/http/data-http-response'
import type { File as File_ } from '../../../../shared/types/features/file'
import type { BootstrapsRes } from '../../../../shared/types/features/bootstraps'

class ApiBootstrapsService {
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

  async deleteBootstrap(platform: string) {
    return await http.delete<DataHttpResponse<BootstrapsRes>>('/api/bootstraps', { platform })
  }
}

export default new ApiBootstrapsService()
