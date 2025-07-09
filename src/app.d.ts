import type { LanguageCode } from "$lib/stores/language"
import type { IUser } from "$lib/utils/types"

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      isConfigured: boolean
      env: {
        language: LanguageCode
        name: string
        theme: string
        version: string
      },
      user?: IUser
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {}

