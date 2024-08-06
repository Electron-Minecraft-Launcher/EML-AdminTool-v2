import { redirect } from '@sveltejs/kit'
import cookiesService from '../../../../services/cookies.service'
import type { PageLoad } from './$types'
import type { BootstrapsRes } from '../../../../../../shared/types/features/bootstraps'
import apiBootstrapsService from '../../../../services/api/api-bootstraps.service'

export const load: PageLoad = async ({ parent }) => {
  let bootstraps: BootstrapsRes = { version: '', win: null, mac: null, lin: null }

  if (!cookiesService.get('JWT')) throw redirect(300, '/login')
  if (!(await parent()).user.p_bootstraps_mod) throw redirect(300, '/dashboard')
  
  ;(await apiBootstrapsService.getBootstraps()).subscribe({
    next: (res) => {
      bootstraps = res.body.data!
    }
  })

  return { bootstraps }
}
