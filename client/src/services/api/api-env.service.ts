import http from '../http.module'
import type { DefaultHttpResponse } from '$models/responses/default-http-response.model'
import type { DataHttpResponse } from '$models/responses/data-http-response.model'
import type { User } from '$models/features/user.model'

export default class ApiEnvService {
  async getEnv() {
    return await http.get<DataHttpResponse<any>>('/api/env')
  }
}
