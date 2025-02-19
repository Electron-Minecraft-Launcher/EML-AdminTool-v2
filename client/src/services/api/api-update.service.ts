import http from '../http.module'
import type { DataHttpResponse } from '../../../../shared/types/responses/http/data-http-response'
import type { StatsRes } from '../../../../shared/types/features/stats'
import type { Update } from '../../../../shared/types/data/update'

class ApiEnvService {
  async getUpdate() {
    return await http.get<DataHttpResponse<Update>>('/api/update')
  }

  async postUpdate() {
    return await http.post<DataHttpResponse<StatsRes>>('/api/update')
  }
}

export default new ApiEnvService()
