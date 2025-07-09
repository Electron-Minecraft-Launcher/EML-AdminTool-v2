import type { LanguageCode } from '../stores/language'

export type Env = {
  language: LanguageCode
  name: string
  theme: string
  version: string
}

export interface VPS {
  os: string
  storage: number[]
}

export interface Update {
  currentVersion: string
  latestVersion: string
  releaseDate: string
  logoUrl: string
  changelogs: string
}
