import { redirect } from '@sveltejs/kit'
import cookiesService from '../../../../services/cookies.service'
import type { PageLoad } from './$types'
import apiBackgroundsService from '../../../../services/api/api-backgrounds.service'
import type { BackgroundsRes } from '../../../../../../shared/types/features/background'

export const load: PageLoad = async ({ parent }) => {
  let backgrounds: BackgroundsRes[] = []

  if (!cookiesService.get('JWT')) throw redirect(300, '/login')
  if (!(await parent()).user.p_background_mod) throw redirect(300, '/dashboard')
  
    ;(await apiBackgroundsService.getBackgrounds()).subscribe({
    next: (res) => {
      backgrounds = res.body.data!
    }
  })

  return { backgrounds }
}
