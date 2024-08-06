import http from '../http.module'
import type { DataHttpResponse } from '../../../../shared/types/responses/http/data-http-response'
import type { File as File_ } from '../../../../shared/types/features/file'
import type { BackgroundsRes } from '../../../../shared/types/features/background'

class ApiBackgroundsService {
  async getBackgrounds() {
    return await http.get<DataHttpResponse<BackgroundsRes[]>>('/api/backgrounds')
  }

  async getBackground(id: number) {
    return await http.get<DataHttpResponse<BackgroundsRes>>('/api/backgrounds/' + id)
  }

  async uploadBackground(title: string, status: 0 | 1, file: File) {
    let body = new FormData()
    body.set('title', title)
    body.set('status', status as any)
    body.append('file', file)
    return await http.post<DataHttpResponse<BackgroundsRes[]>>('/api/backgrounds', body)
  }

  async putActiveBackground(background_id: number) {
    return await http.put<DataHttpResponse<BackgroundsRes[]>>('/api/backgrounds', { background_id })
  }

  async putBackgroundTitle(id: number, title: string) {
    return await http.put<DataHttpResponse<BackgroundsRes[]>>('/api/backgrounds/' + id, { title })
  }

  async deleteBackground(id: number) {
    return await http.delete<DataHttpResponse<BackgroundsRes[]>>('/api/backgrounds/' + id)
  }
}

export default new ApiBackgroundsService()
