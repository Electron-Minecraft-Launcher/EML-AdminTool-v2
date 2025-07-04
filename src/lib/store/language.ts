import { writable, derived } from 'svelte/store'
import en from '../../../assets/locales/en'
import fr from '../../../assets/locales/fr'
import da from '../../../assets/locales/da'

const languages = { en, fr, da }

export type LanguageCode = keyof typeof languages
export const currentLanguage = writable<LanguageCode>('en')

export const l = derived(currentLanguage, ($currentLanguage) => {
  const selected = languages[$currentLanguage] ?? en
  return createTranslationProxy(selected, languages.en)
})

function createTranslationProxy(selected: any, fallback: any): any {
  return new Proxy(
    {},
    {
      get(_, key) {
        if (typeof key !== 'string') return undefined

        if (key in selected) {
          const value = selected[key]
          if (typeof value === 'object' && value !== null) {
            return createTranslationProxy(value, fallback?.[key] ?? {})
          }
          return value
        }

        if (key in fallback) {
          const value = fallback[key]
          if (typeof value === 'object' && value !== null) {
            return createTranslationProxy(value, fallback[key])
          }
          console.warn(`Missing translation for '${key}', using fallback.`)
          return value
        }

        console.error(`Missing translation for '${key}' in both selected and fallback.`)
        return key
      }
    }
  )
}
