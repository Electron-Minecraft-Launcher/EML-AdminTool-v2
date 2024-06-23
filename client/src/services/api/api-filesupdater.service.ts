import http from '../http.module'
import type { DataHttpResponse } from '../../../../shared/models/responses/http/data-http-response.model'
import type { DefaultHttpResponse } from '../../../../shared/models/responses/http/default-http-response.model'
import type { EMLAdminToolInfo } from '../../../../shared/models/features/emlat-info.model'
import type { User } from '../../../../shared/models/features/user.model'
import type { File as File_ } from '../../../../shared/models/features/filesupdater.model'

class ApiFilesUpdaterService {
  async getFilesUpdater() {
    return await http.get<DataHttpResponse<File_[]>>('/api/files-updater')
  }

  async uploadFiles(path: string, files: File[]) {
    let body = new FormData()
    body.set('path', path)
    for (let i = 0; i < files.length; i++) {
      body.append('files[]', files[i])
    }
    console.log(body)
    return await http.post<DataHttpResponse<File_[]>>('/api/files-updater', body)
  }

  async renameFile(old_path: string, new_path: string) {
    return await http.put<DataHttpResponse<File_[]>>('/api/files-updater', { old_path, new_path })
  }

  async deleteFiles(id: number | 'me' = 'me') {
    return await http.get<DataHttpResponse<User>>('/api/users/' + id)
  }
}

export default new ApiFilesUpdaterService()