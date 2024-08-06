import http from '../http.module'
import type { DefaultHttpResponse } from '../../../../shared/types/responses/http/default-http-response'

class ApiConfigureService {
  async getConfigure() {
    return await http.get<DefaultHttpResponse>('/api/configure/check')
  }

  async putLanguage(language: string) {
    return await http.put<DefaultHttpResponse>('/api/configure/language', { language })
  }

  async putDbPassword(password: string) {
    return await http.put<DefaultHttpResponse>('/api/configure/database', { password })
  }

  async putAdmin(name: string, password: string) {
    return await http.put<DefaultHttpResponse>('/api/configure/admin', { password, name })
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
