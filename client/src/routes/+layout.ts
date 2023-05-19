import type { LayoutLoad } from './$types'
import { env$ } from '$services/store'
import ApiEnvService from '$services/api/api-env.service'
import ApiConfigureService from '$services/api/api-configure.service'
import ApiAuthService from '$services/api/api-auth.service'
import CookiesService from '$services/cookies.service'
import en from '$assets/language/en'
import fr from '$assets/language/fr'
import type { Env } from '$models/data/env.model'

export const prerender = true
export const ssr = false

const apiEnv = new ApiEnvService()
const apiConfigure = new ApiConfigureService()
const apiAuth = new ApiAuthService()
const cookies = new CookiesService()

let ready1 = false
let ready2 = false
let ready3 = false
let ready = ready1 && ready2 && ready3

let to = ''
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
      ready1 = true
      ready = ready1 && ready2 && ready3
    },
  })
  ;(await apiConfigure.getConfigure()).subscribe({
    next: (resp) => {
      ready2 = true
      ready = ready1 && ready2 && ready3
    },
    error: (err) => {
      ready2 = true
      ready = ready1 && ready2 && ready3
    },
  })

  if (cookies.get('JWT')) {
    ;(await apiAuth.getVerify()).subscribe({
      next: (resp) => {
        if (window.location.pathname == '/' || window.location.pathname == '/login' || window.location.pathname == '/register') {
          to = '/dashboard'
        }
        ready3 = true
        ready = ready1 && ready2 && ready3
      },
      error: (err) => {
        ready3 = true
        ready = ready1 && ready2 && ready3
      },
    })
  } else {
    ready3 = true
    ready = ready1 && ready2 && ready3
    console.log('')

    to = '/login'
  }

  return { ready, to }
}
