import type { User } from '../../../shared/types/features/user'
import apiAdminService from './api/api-admin.service'
import cookiesService from './cookies.service'
import { user } from './store'

class UserService {
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

export default new UserService()