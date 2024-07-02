import http from '../http.module'
import type { DataHttpResponse } from '../../../../shared/models/responses/http/data-http-response.model'
import type { File as File_ } from '../../../../shared/models/features/file.model'
import type { BackgroundsRes } from '../../../../shared/models/features/background.model'

class ApiBackgroundsService {
  async getBackgrounds() {
    return await http.get<DataHttpResponse<BackgroundsRes[]>>('/api/backgrounds')
  }

  async getBackground(id: number) {
    return await http.get<DataHttpResponse<BackgroundsRes>>('/api/backgrounds' + id)
  }

  async uploadBootstrap(title: string, status: 0 | 1, file: File) {
    let body = new FormData()
    body.set('title', title)
    body.set('status', status as any)
    body.append('file', file)
    return await http.post<DataHttpResponse<BackgroundsRes[]>>('/api/backgrounds', body)
  }

  async putActiveBackground(id: number) {
    return await http.put<DataHttpResponse<BackgroundsRes[]>>('/api/backgrounds', { id })
  }

  async putBackgroundTitle(id: number, title: string) {
    return await http.put<DataHttpResponse<BackgroundsRes[]>>('/api/backgrounds' + id, { title })
  }

  async deleteBackground(id: number) {
    return await http.delete<DataHttpResponse<BackgroundsRes[]>>('/api/bootstraps' + id)
  }
}

export default new ApiBackgroundsService()
