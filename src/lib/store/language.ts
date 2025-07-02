import { writable, derived } from 'svelte/store'
import en from '../../../assets/locales/en'
import fr from '../../../assets/locales/fr'
import da from '../../../assets/locales/da'

const languages = { en, fr, da }

export type LanguageCode = keyof typeof languages
export const currentLanguage = writable<LanguageCode>('en')

export const l = derived(currentLanguage, ($currentLanguage) => {
  const selected = languages[$currentLanguage] ?? en

  return new Proxy(
    {},
    {
      get(_, key: string) {
        if (key in selected) {
          return selected[key as keyof typeof en]
        }
        if (key in en) {
          console.warn(`Missing translation for '${key}' in '${$currentLanguage}', using fallback.`)
          return en[key as keyof typeof en]
        }
        console.error(`Missing translation for '${key}' in '${$currentLanguage}' AND in fallback.`)
        return key
      }
    }
  ) as typeof en
})
