import { redirect } from '@sveltejs/kit'
import apiAuthService from '../../../../services/api/api-auth.service'
import cookiesService from '../../../../services/cookies.service'
import { user } from '../../../../services/store'
import type { PageLoad } from './$types'
import type { BootstrapsRes } from '../../../../../../shared/models/features/bootstraps.model'
import apiBootstrapsService from '../../../../services/api/api-bootstraps.service'

export const load: PageLoad = async () => {
  let bootstraps: BootstrapsRes = {
    version: '',
    win: null,
    mac: null,
    lin: null
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

  ;(await apiBootstrapsService.getBootstraps()).subscribe({
    next: (res) => {
      bootstraps = res.body.data!
    }
  })

  return { bootstraps }
}
