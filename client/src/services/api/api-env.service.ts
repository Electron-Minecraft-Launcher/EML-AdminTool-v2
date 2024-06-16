import http from '../http.module'
import type { DataHttpResponse } from '../../../../shared/models/responses/http/data-http-response.model'

class ApiEnvService {
  async getEnv() {
    return await http.get<DataHttpResponse<any>>('/api/env')
  }
}

export default new ApiEnvService()
