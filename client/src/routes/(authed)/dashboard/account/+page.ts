import type { PageLoad } from './$types'
import ApiAuthService from '$services/api/api-auth.service'
import CookiesService from '$services/cookies.service'
import { user$ } from '$services/store'
import { redirect } from '@sveltejs/kit'

const apiAuth = new ApiAuthService()
const cookies = new CookiesService()

export const load: PageLoad = async () => {
  if (cookies.get('JWT')) {
    ;(await apiAuth.getVerify()).subscribe({
      next: (res) => {
        user$.set(res.body!.data!.user)
      },
    })
  } else {
    throw redirect(300, '/login')
  }
}
