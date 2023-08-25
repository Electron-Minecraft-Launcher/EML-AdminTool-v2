import type { User } from '$models/features/user.model'
import ApiAdminService from './api/api-admin.service'
import CookiesService from './cookies.service'
import cookiesService from './cookies.service'
import { user$ } from './store'

const cookies = new CookiesService()
const apiAdmin = new ApiAdminService()

export default class UserService {
  async reload() {
    if (cookies.get('JWT')) {
      ;(await apiAdmin.getUser()).subscribe({
        next: (res) => {
          user$.set(res.body.data!)
        },
        error: () => {},
      })
    }
    return true
  }
}
