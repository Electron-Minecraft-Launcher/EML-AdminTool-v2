import { redirect } from '@sveltejs/kit'
import apiAuthService from '../../../../services/api/api-auth.service'
import cookiesService from '../../../../services/cookies.service'
import { user } from '../../../../services/store'
import type { PageLoad } from './$types'
import type { BootstrapsRes } from '../../../../../../shared/models/features/bootstraps.model'
import apiBootstrapsService from '../../../../services/api/api-bootstraps.service'
import type { StatsRes } from '../../../../../../shared/models/features/stats.model'
import apiStatsService from '../../../../services/api/api-stats.service'

export const load: PageLoad = async () => {
  let stats: StatsRes = {
    startups: [],
    launches: [],
    connections: [],
    devtools: []
  }

  if (cookiesService.get('JWT')) {
    ;(await apiAuthService.getVerify()).subscribe({
      next: (res) => {
        user.set(res.body!.data!.user)
        if (res.body!.data!.user.p_stats_see != 1) {
          throw redirect(300, '/dashboard')
        }
      }
    })
  } else {
    throw redirect(300, '/login')
  }

  ;(await apiStatsService.getStats()).subscribe({
    next: (res) => {
      stats = res.body.data!
    }
  })

  return { stats }
}
