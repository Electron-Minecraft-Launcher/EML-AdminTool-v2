import type { PageLoad } from './$types'
import cookiesService from '../../services/cookies.service'
import apiAuthService from '../../services/api/api-auth.service'
import apiConfigureService from '../../services/api/api-configure.service'
import router from '../../services/router'
import { redirect } from '@sveltejs/kit'

export const load: PageLoad = async () => {
  let start = false

  if (cookiesService.get('JWT')) {
    ;(await apiAuthService.getVerify()).subscribe({
      next: () => {
        redirect(300, '/dashboard');
      },
    })
  }

  ;(await apiConfigureService.getConfigure()).subscribe({
    finally: (res) => {
      if (res.body?.code == 'SUCCESS') {
        redirect(300, '/');
      } else {
        start = true
      }
    },
  })

  return { start }
}
