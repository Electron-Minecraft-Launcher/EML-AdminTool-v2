import type { PageLoad } from './$types'
import apiAuthService from '../../../../services/api/api-auth.service'
import apiAdminService from '../../../../services/api/api-admin.service'
import cookiesService from '../../../../services/cookies.service'
import notificationsService from '../../../../services/notifications.service'
import { user$ } from '../../../../services/store'
import { redirect } from '@sveltejs/kit'
import type { EMLAdminToolInfo } from '../../../../../../shared/models/features/emlat-info.model'

export const load: PageLoad = async () => {
  let data!: EMLAdminToolInfo

  if (cookiesService.get('JWT')) {
    ;(await apiAuthService.getVerify()).subscribe({
      next: (res) => {
        user$.set(res.body!.data!.user)
        if (!res.body.data?.user.admin) {
          notificationsService.update({ type: 'ERROR', code: 'permission' })
          throw redirect(300, '/dashboard')
        }
      },
    })
  } else {
    throw redirect(300, '/login')
  }

  ;(await apiAdminService.getAdminTool()).subscribe({
    next: (res) => {
      data = res.body.data!
    },
  })

  ;(await apiAdminService.getUsers()).subscribe({
    next: (res) => {
      data.users = res.body.data!
    },
  })

  return data
}
