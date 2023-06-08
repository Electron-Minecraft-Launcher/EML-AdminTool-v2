import type { PageLoad } from './$types'
import CookiesService from '$services/cookies.service'
import ApiAuthService from '$services/api/api-auth.service'
import router from '$services/router'

const cookies = new CookiesService()
const apiAuth = new ApiAuthService()

export const load: PageLoad = async () => {
  // if (cookies.get('JWT')) {
  //   ;(await apiAuth.getVerify()).subscribe({
  //     next: (res) => {
  //       router.goto('/dashboard')
  //     },
  //   })
  // }
}
