import type { PageLoad } from './$types'
import apiConfigureService from '../../../services/api/api-configure.service'
import apiAuthService from '../../../services/api/api-auth.service'
import cookiesService from '../../../services/cookies.service'
import { redirect } from '@sveltejs/kit'
import { user } from '../../../services/store'

export const load: PageLoad = async () => {
  ;(await apiConfigureService.getConfigure()).subscribe({
    finally: (res) => {
      if (res.body.code == 'CONFIG_ERROR') {
        redirect(300, '/configure');
      }
    },
  })

  if (cookiesService.get('JWT')) {
    ;(await apiAuthService.getVerify()).subscribe({
      next: (res) => {
        user.set(res.body.data!.user)
        redirect(300, '/dashboard');
      },
    })
  }
}
