import type { PageLoad } from './$types'
import ApiAuthService from '$services/api/api-auth.service'
import CookiesService from '$services/cookies.service'
import ApiAdminService from '$services/api/api-admin.service'
import { user$ } from '$services/store'
import { redirect } from '@sveltejs/kit'
import NotificationsService from '$services/notifications.service'
import type { EMLAdminToolInfo } from '$models/features/emlat-info.model'

const apiAuth = new ApiAuthService()
const cookies = new CookiesService()
const apiAdmin = new ApiAdminService()
const notifications = new NotificationsService()

export const load: PageLoad = async () => {
  let data!: EMLAdminToolInfo

  if (cookies.get('JWT')) {
    ;(await apiAuth.getVerify()).subscribe({
      next: (res) => {
        user$.set(res.body!.data!.user)
        if (!res.body.data?.user.admin) {
          notifications.update({ type: 'ERROR', code: 'permission' })
          throw redirect(300, '/dashboard')
        }
      },
    })
  } else {
    throw redirect(300, '/login')
  }

  ;(await apiAdmin.getAdminTool()).subscribe({
    next: (res) => {
      data = res.body.data!
    },
  })

  return data
}
