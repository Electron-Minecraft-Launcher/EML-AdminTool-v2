import http from '../http.module'
import type { DefaultHttpResponse } from '$models/responses/default-http-response.model'

export default class ApiConfigureService {
  async getConfigure() {
    return await http.get<DefaultHttpResponse>('/api/configure')
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
}
