import type { LanguageCode } from '../stores/language'

export type Env = {
  language: LanguageCode
  name: string
  theme: string
  version: string
}

export type IUser = {
  id: string
  username: string
  isAdmin: boolean
  p_filesUpdater: 0 | 1
  p_loader: 0 | 1
  p_bootstraps: 0 | 1
  p_maintenance: 0 | 1
  p_news: 0 | 1 | 2
  p_newsCategories: 0 | 1
  p_newsTags: 0 | 1
  p_backgrounds: 0 | 1
  p_stats: 0 | 1 | 2
}
