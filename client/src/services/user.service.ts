import type { User } from '../../../shared/models/features/user.model'
import apiAdminService from './api/api-admin.service'
import cookiesService from './cookies.service'
import { user } from './store'

export default class UserService {
  async reload() {
    if (cookiesService.get('JWT')) {
      ;(await apiAdminService.getUser()).subscribe({
        next: (res) => {
          user.set(res.body.data!)
        },
      })
    }
    return true
  }
}
