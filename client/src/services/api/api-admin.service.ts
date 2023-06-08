import http from '../http.module'
import type { DefaultHttpResponse } from '$models/responses/default-http-response.model'
import type { DataHttpResponse } from '$models/responses/data-http-response.model'
import type { User } from '$models/features/user.model'

export default class ApiAdminService {
  async getUsers() {
    return await http.get<DataHttpResponse<User[]>>('/api/users')
  }

  async getUser(id: number | 'me' = 'me') {
    return await http.get<DataHttpResponse<User>>('/api/users/' + id)
  }

  async putUser() {
    return await http.get<DataHttpResponse<{ jwt: string; user: User }>>('/api/verify')
  }

  async deleteUser() {
    return await http.delete<DefaultHttpResponse>('/api/logout')
  }
}
