import { redirect } from '@sveltejs/kit'
import type { Maintenance } from '../../../../../../shared/types/features/maintenance'
import cookiesService from '../../../../services/cookies.service'
import type { PageLoad } from './$types'
import apiMaintenanceService from '../../../../services/api/api-maintenance.service'

export const load: PageLoad = async ({ parent }) => {
  let maintenance: Maintenance = { start_date: null, end_date: null, reason: '' }

  if (!cookiesService.get('JWT')) redirect(300, '/login')
  if (!(await parent()).user.p_maintenance_mod) redirect(300, '/dashboard')
    
  ;(await apiMaintenanceService.getMaintenanceStatus()).subscribe({
    next: (res) => {
      maintenance = res.body.data!
    }
  })

  return { maintenance }
}
