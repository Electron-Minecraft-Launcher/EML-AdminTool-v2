import type { PageLoad } from './$types'
import CookiesService from '$services/cookies.service'
import ApiAuthService from '$services/api/api-auth.service'
import ApiConfigureService from '$services/api/api-configure.service'
import router from '$services/router'
import { redirect } from '@sveltejs/kit'

const cookies = new CookiesService()
const apiAuth = new ApiAuthService()
const apiConfigure = new ApiConfigureService()

export const load: PageLoad = async () => {
  let start = false

  if (cookies.get('JWT')) {
    ;(await apiAuth.getVerify()).subscribe({
      next: () => {
        throw redirect(300, '/dashboard')
      },
    })
  }

  ;(await apiConfigure.getConfigure()).subscribe({
    finally: (res) => {
      if (res.body?.code == 'SUCCESS') {
        throw redirect(300, '/')
      } else {
        start = true
      }
    },
  })

  return { start }
}
