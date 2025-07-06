import type { LanguageCode } from "$lib/store/language"

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
      user?: {
        id: string
        isAdmin: boolean
        
      }
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {}

