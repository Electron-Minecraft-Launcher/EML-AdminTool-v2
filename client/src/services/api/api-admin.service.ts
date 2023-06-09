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

  async putUser(id: number | 'me' = 'me', user: User) {
    return await http.put<DataHttpResponse<{ jwt: string; user: User }>>('/api/users/' + id, user)
  }

  async deleteUser(id: number | 'me' = 'me') {
    return await http.delete<DefaultHttpResponse>('/api/users/' + id)
  }
}
