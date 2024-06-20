import type { PageLoad } from './$types'
import apiAuthService from '../../../../services/api/api-auth.service'
import apiAdminService from '../../../../services/api/api-admin.service'
import cookiesService from '../../../../services/cookies.service'
import notificationsService from '../../../../services/notifications.service'
import { user } from '../../../../services/store'
import { redirect } from '@sveltejs/kit'
import type { EMLAT, VPS } from '../../../../../../shared/models/features/emlat-info.model'
import type { User } from '../../../../../../shared/models/features/user.model'

export const load: PageLoad = async () => {
  let emlat!: EMLAT
  let users!: User[]
  let vps!: VPS

  if (cookiesService.get('JWT')) {
    ;(await apiAuthService.getVerify()).subscribe({
      next: (res) => {
        user.set(res.body!.data!.user)
        if (!res.body.data?.user.admin) {
          notificationsService.update({ type: 'ERROR', code: 'permission' })
          throw redirect(300, '/dashboard')
        }
      }
    })
  } else {
    throw redirect(300, '/login')
  }

  ;(await apiAdminService.getAdminTool()).subscribe({
    next: (res) => {
      emlat = res.body.data?.emlat!
      vps = res.body.data?.vps!
      users = res.body.data?.users!
    }
  })

  return { emlat, users, vps}
}
