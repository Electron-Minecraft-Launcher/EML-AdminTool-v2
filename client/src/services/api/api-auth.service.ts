import http from '../http.module'
import type { DefaultHttpResponse } from '../../../../shared/types/responses/http/default-http-response'
import type { DataHttpResponse } from '../../../../shared/types/responses/http/data-http-response'
import type { User } from '../../../../shared/types/features/user'
import { Buffer } from 'buffer'

class ApiAuthService {
  async getAuth(name: string, password: string) {
    const req: RequestInit = {
      headers: {
        Authorization: 'Basic ' + Buffer.from(name + ':' + password).toString('base64'),
      },
    }
    return await http.get<DataHttpResponse<{ jwt: string; user: User }>>('/api/auth', req)
  }

  async postRegister(name: string, password: string, pin: string) {
    return await http.post<DataHttpResponse<{ jwt: string; user: User }>>('/api/register', { name, password, pin })
  }

  async getVerify() {
    return await http.get<DataHttpResponse<{ jwt: string; user: User }>>('/api/verify')
  }

  async deleteLogout() {
    return await http.delete<DefaultHttpResponse>('/api/logout')
  }
}

export default new ApiAuthService()