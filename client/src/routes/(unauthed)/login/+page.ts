import type { PageLoad } from './$types'
import ApiConfigureService from '$services/api/api-configure.service'
import ApiAuthService from '$services/api/api-auth.service'
import CookiesService from '$services/cookies.service'
import { redirect } from '@sveltejs/kit'
import { user$ } from '$services/store'

const apiConfigure = new ApiConfigureService()
const apiAuth = new ApiAuthService()
const cookies = new CookiesService()

export const load: PageLoad = async () => {
  ;(await apiConfigure.getConfigure()).subscribe({
    finally: (res) => {
      if (res.body.code == 'CONFIG_ERROR') {
        throw redirect(300, '/configure')
      }
    },
  })

  if (cookies.get('JWT')) {
    ;(await apiAuth.getVerify()).subscribe({
      next: (res) => {
        user$.set(res.body.data!.user)
        throw redirect(300, '/dashboard')
      },
    })
  }
}
