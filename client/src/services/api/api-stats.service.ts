import http from '../http.module'
import type { DataHttpResponse } from '../../../../shared/models/responses/http/data-http-response.model'
import type { StatsRes } from '../../../../shared/models/features/stats.model'

class ApiEnvService {
  async getStats() {
    return await http.get<DataHttpResponse<StatsRes>>('/api/stats')
  }

  async deleteStats() {
    return await http.delete<DataHttpResponse<StatsRes>>('/api/stats')
  }
}

export default new ApiEnvService()
