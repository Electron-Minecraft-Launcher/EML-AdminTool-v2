import http from '../http.module'
import type { DefaultHttpResponse } from '$models/responses/default-http-response.model'
import type { DataHttpResponse } from '$models/responses/data-http-response.model'
import type { User } from '$models/features/user.model'
import { Buffer } from 'buffer'

export default class ApiAuthService {
  async getAuth(name: string, password: string) {
    const req: RequestInit = {
      headers: {
        Authorization: 'Basic ' + Buffer.from(name + ':' + password).toString('base64'),
      },
    }
    return await http.get<DataHttpResponse<{ jwt: string; user: User }>>('/api/auth', req)
  }

  async postRegister(name: string, password: string, pin: string) {
    const body = { name, password, pin }
    return await http.post<DataHttpResponse<{ jwt: string; user: User }>>('/api/register', body)
  }

  async getVerify() {
    return await http.get<DataHttpResponse<{ jwt: string; user: User }>>('/api/verify')
  }

  async deleteLogout() {
    return await http.delete<DefaultHttpResponse>('/api/logout')
  }
}
