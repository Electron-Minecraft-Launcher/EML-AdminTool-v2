import type { LayoutLoad } from './$types'
import { env$ } from '../services/store'
import apiEnvService from '../services/api/api-env.service'
import en from '../assets/language/en'
import fr from '../assets/language/fr'

export const prerender = true
export const ssr = false


export const load: LayoutLoad = async () => {
  let env!: any

  ;(await apiEnvService.getEnv()).subscribe({
    next: (resp) => {
      env = resp.body.data
      if (!env.name) {
        env = {
          language: 'en',
          name: 'EML',
          theme: 'eml',
        }
      }
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
}
