import { redirect } from '@sveltejs/kit'
import cookiesService from '../../../../services/cookies.service'
import { user } from '../../../../services/store'
import type { PageLoad } from './$types'
import type { StatsRes } from '../../../../../../shared/types/features/stats'
import apiStatsService from '../../../../services/api/api-stats.service'
import { get } from 'svelte/store'

export const load: PageLoad = async ({ parent }) => {
  let stats: StatsRes = { startups: [], launches: [], connections: [], devtools: [] }

  if (!cookiesService.get('JWT')) redirect(300, '/login')
  if (!(await parent()).user.p_stats_see) redirect(300, '/dashboard')

  ;(await apiStatsService.getStats()).subscribe({
    next: (res) => {
      stats = res.body.data!
    }
  })

  return { stats }
}
