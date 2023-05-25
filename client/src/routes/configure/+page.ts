import type { PageLoad } from './$types'
import CookiesService from '$services/cookies.service'
import ApiAuthService from '$services/api/api-auth.service'
import ApiConfigureService from '$services/api/api-configure.service'
import { goto } from '$app/navigation'
import router from '$services/router'

const cookies = new CookiesService()
const apiAuth = new ApiAuthService()
const apiConfigure = new ApiConfigureService()

export const load: PageLoad = async () => {
  let start = false

  if (cookies.get('JWT')) {
    ;(await apiAuth.getVerify()).subscribe({
      next: (res) => {
        goto('/dashboard')
      },
    })
  }

  ;(await apiConfigure.getConfigure()).subscribe({
    finally: (res) => {
      if (res.body?.code == 'SUCCESS') {
        router.goto('/')
      } else {
        start = true
      }
    },
  })

  return { start }
}
