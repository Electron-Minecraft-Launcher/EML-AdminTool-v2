import type { LayoutLoad } from './$types'
import { env$ } from '$services/store'
import ApiEnvService from '$services/api/api-env.service'
import ApiConfigureService from '$services/api/api-configure.service'
import ApiAuthService from '$services/api/api-auth.service'
import CookiesService from '$services/cookies.service'
import en from '$assets/language/en'
import fr from '$assets/language/fr'
import type { Env } from '$models/data/env.model'
import router from '$services/router'

const apiEnv = new ApiEnvService()
const apiConfigure = new ApiConfigureService()
const apiAuth = new ApiAuthService()
const cookies = new CookiesService()

let redirect = false
let env!: Env

export const load: LayoutLoad = async () => {
  ;(await apiEnv.getEnv()).subscribe({
    next: (resp) => {
      env = resp.body.data
    },
    error: () => {
      env = {
        language: 'en',
        name: 'EML',
        theme: 'eml',
      }
    },
    finally: () => {
      if (env.language == 'fr') {
        env.language = fr
      } else {
        env.language = en
      }
      env$.set(env)
    },
  })

  if (cookies.get('JWT')) {
    ;(await apiAuth.getVerify()).subscribe({
      next: () => {
        if (window.location.pathname == '/' || window.location.pathname == '/login' || window.location.pathname == '/register') {
          router.goto('/dashboard')
          redirect = true
        }
      },
    })
  } else {
    if (window.location.pathname != '/register') {
      router.goto('/login')
      redirect = true
    }
  }

  ;(await apiConfigure.getConfigure()).subscribe({
    finally: (resp) => {
      if (resp.body.code == 'CONFIG_ERROR') {
        redirect = true
      }
    },
  })

  return { redirect }
}
