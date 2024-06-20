import type { PageLoad } from './$types'
import apiAuthService from '../../../../services/api/api-auth.service'
import cookiesService from '../../../../services/cookies.service'
import { user } from '../../../../services/store'
import { redirect } from '@sveltejs/kit'

export const load: PageLoad = async () => {
  if (cookiesService.get('JWT')) {
    ;(await apiAuthService.getVerify()).subscribe({
      next: (res) => {
        user.set(res.body!.data!.user)
      },
    })
  } else {
    throw redirect(300, '/login')
  }
}
