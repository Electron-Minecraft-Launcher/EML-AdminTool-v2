import http from '../http.module'
import type { DefaultHttpResponse } from '../../../../shared/models/responses/http/default-http-response.model'

class ApiConfigureService {
  async getConfigure() {
    return await http.get<DefaultHttpResponse>('/api/configure/check')
  }

  async putLanguage(language: string) {
    const req = { language: language }
    return await http.put<DefaultHttpResponse>('/api/configure/language', req)
  }

  async putDbPassword(password: string) {
    const req = { password: password }
    return await http.put<DefaultHttpResponse>('/api/configure/database', req)
  }

  async putAdmin(name: string, password: string) {
    const req = { password: password, name: name }
    return await http.put<DefaultHttpResponse>('/api/configure/admin', req)
  }

  async deleteReset() {
    return await http.delete<DefaultHttpResponse>('/api/reset')
  }
}

export default new ApiConfigureService()

// interface DefaultHttpResponse {
//   code: any
//   message: string
// }