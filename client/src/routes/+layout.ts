import type { LayoutLoad } from './$types'
import { env, l } from '../services/store'
import apiEnvService from '../services/api/api-env.service'
import en from '../assets/language/en'
import fr from '../assets/language/fr'

export const prerender = true
export const ssr = false


export const load: LayoutLoad = async () => {
  let env_!: any

  ;(await apiEnvService.getEnv()).subscribe({
    next: (resp) => {
      env_ = resp.body.data
      if (!env_.name) {
        env_ = {
          language: 'en',
          name: 'EML',
          theme: 'eml',
        }
      }
    },
    error: () => {
      env_ = {
        language: 'en',
        name: 'EML',
        theme: 'eml',
      }
    },
    finally: () => {
      if (env_.language == 'fr') {
        env_.language = fr
      } else {
        env_.language = en
      }
      env.set(env_)
      l.set(env_.language)
    },
  })
}
