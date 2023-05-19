import type { PageLoad } from './$types'
import CookiesService from '$services/cookies.service'
import ApiAuthService from '$services/api/api-auth.service'
import { goto } from '$app/navigation'

const cookies = new CookiesService()
const apiAuth = new ApiAuthService()

let to = ''

export const load: PageLoad = async () => {
  console.log('ho');
  
  if (cookies.get('JWT')) {
    ;(await apiAuth.getVerify()).subscribe({
      next: (res) => {
        goto('/dashboard')
      },
    })
  }
}
