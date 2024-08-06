import http from '../http.module'
import type { DataHttpResponse } from '../../../../shared/types/responses/http/data-http-response'
import type { StatsRes } from '../../../../shared/types/features/stats'

class ApiEnvService {
  async getStats() {
    return await http.get<DataHttpResponse<StatsRes>>('/api/stats')
  }

  async deleteStats() {
    return await http.delete<DataHttpResponse<StatsRes>>('/api/stats')
  }
}

export default new ApiEnvService()
