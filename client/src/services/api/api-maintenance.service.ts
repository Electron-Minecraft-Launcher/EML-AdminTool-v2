import http from '../http.module'
import type { DataHttpResponse } from '../../../../shared/models/responses/http/data-http-response.model'
import type { Maintenance } from '../../../../shared/models/features/maintenance.model'

class ApiMaintenanceService {
  async getMaintenanceStatus() {
    return await http.get<DataHttpResponse<Maintenance>>('/api/maintenance')
  }

  async putMaintenanceStatus(start_date: Date | null, end_date: Date | null, reason: string = '') {
    return await http.put<DataHttpResponse<Maintenance>>('/api/maintenance', { start_date, end_date, reason })
  }
}

export default new ApiMaintenanceService()
