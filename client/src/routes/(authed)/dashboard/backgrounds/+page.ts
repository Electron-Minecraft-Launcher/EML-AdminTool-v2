import { redirect } from '@sveltejs/kit'
import type { Maintenance } from '../../../../../../shared/models/features/maintenance.model'
import apiAuthService from '../../../../services/api/api-auth.service'
import cookiesService from '../../../../services/cookies.service'
import { user } from '../../../../services/store'
import type { PageLoad } from './$types'
import apiMaintenanceService from '../../../../services/api/api-maintenance.service'
import apiBackgroundsService from '../../../../services/api/api-backgrounds.service'
import type { BackgroundsRes } from '../../../../../../shared/models/features/background.model'

export const load: PageLoad = async () => {
  let backgrounds: BackgroundsRes[] = []

  if (cookiesService.get('JWT')) {
    ;(await apiAuthService.getVerify()).subscribe({
      next: (res) => {
        user.set(res.body!.data!.user)
        if (res.body!.data!.user.p_background_mod != 1) {
          throw redirect(300, '/dashboard')
        }
      }
    })
  } else {
    throw redirect(300, '/login')
  }

  ;(await apiBackgroundsService.getBackgrounds()).subscribe({
    next: (res) => {
      backgrounds = res.body.data!
    }
  })

  return { backgrounds }
}
