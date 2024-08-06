import http from '../http.module'
import type { DataHttpResponse } from '../../../../shared/types/responses/http/data-http-response'

class ApiEnvService {
  async getEnv() {
    return await http.get<DataHttpResponse<any>>('/api/env')
  }
}

export default new ApiEnvService()
