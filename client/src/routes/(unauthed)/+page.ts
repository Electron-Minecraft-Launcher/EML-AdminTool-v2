import type { LayoutLoad } from '../$types'
import { env$ } from '$services/store'
import ApiEnvService from '$services/api/api-env.service'
import ApiConfigureService from '$services/api/api-configure.service'
import ApiAuthService from '$services/api/api-auth.service'
import CookiesService from '$services/cookies.service'
import en from '$assets/language/en'
import fr from '$assets/language/fr'
import type { Env } from '$models/data/env.model'
import router from '$services/router'
import { redirect } from '@sveltejs/kit'
import { goto } from '$app/navigation'

const apiEnv = new ApiEnvService()
const apiConfigure = new ApiConfigureService()
const apiAuth = new ApiAuthService()
const cookies = new CookiesService()

let env!: Env

export const load: LayoutLoad = async () => { 
  if (cookies.get('JWT')) {
    ;(await apiAuth.getVerify()).subscribe({
      next: () => {
        throw redirect(300, '/dashboard')
      },
    })
  } else {
    if (window.location.pathname != '/register') {
      throw redirect(300, '/login')
    }
  }

  return {}
}
