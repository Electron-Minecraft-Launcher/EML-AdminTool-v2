import type en from '$assets/language/en'
import type fr from '$assets/language/fr'

export interface Env {
  language?: string | typeof en | typeof fr
  name?: string
  theme?: string
}