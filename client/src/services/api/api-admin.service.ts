import http from '../http.module'
import type { DataHttpResponse } from '../../../../shared/models/responses/http/data-http-response.model'
import type { DefaultHttpResponse } from '../../../../shared/models/responses/http/default-http-response.model'
import type { EMLAdminToolInfo } from '../../../../shared/models/features/emlat-info.model'
import type { User } from '../../../../shared/models/features/user.model'

class ApiAdminService {
  async getAdminTool() {
    return await http.get<DataHttpResponse<EMLAdminToolInfo>>('/api/admintool')
  }

  async putAdminTool(name: string = 'EML', language: string = 'en', pin: boolean = false) {
    return await http.put<DataHttpResponse<EMLAdminToolInfo>>('/api/admintool', { name, language, pin })
  }

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

export default new ApiAdminService()
