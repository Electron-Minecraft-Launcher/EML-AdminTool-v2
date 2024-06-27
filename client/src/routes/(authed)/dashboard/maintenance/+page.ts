import { redirect } from '@sveltejs/kit'
import type { Maintenance } from '../../../../../../shared/models/features/maintenance.model'
import apiAuthService from '../../../../services/api/api-auth.service'
import cookiesService from '../../../../services/cookies.service'
import { user } from '../../../../services/store'
import type { PageLoad } from './$types'
import apiMaintenanceService from '../../../../services/api/api-maintenance.service'

export const load: PageLoad = async () => {
  let maintenance: Maintenance = {
    start_date: null,
    end_date: null,
    reason: ''
  }

  if (cookiesService.get('JWT')) {
    ;(await apiAuthService.getVerify()).subscribe({
      next: (res) => {
        user.set(res.body!.data!.user)
        if (res.body!.data!.user.p_files_updater_add_del != 1) {
          throw redirect(300, '/dashboard')
        }
      }
    })
  } else {
    throw redirect(300, '/login')
  }

  ;(await apiMaintenanceService.getMaintenanceStatus()).subscribe({
    next: (res) => {
      maintenance = res.body.data!
    }
  })

  return { maintenance }
}
