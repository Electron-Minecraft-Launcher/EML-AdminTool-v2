import { UserStatus } from '@prisma/client'
import { writable, derived, type Readable } from 'svelte/store'

interface User {
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

export const currentUser = writable<User>()

export const user: Readable<User> = derived(currentUser, ($currentUser) => {
  return $currentUser
})

export const emptyUser = {
  id: '0',
  username: '',
  isAdmin: false,
  status: UserStatus.ACTIVE,
  p_filesUpdater: 0,
  p_loader: 0,
  p_bootstraps: 0,
  p_maintenance: 0,
  p_news: 0,
  p_newsCategories: 0,
  p_newsTags: 0,
  p_backgrounds: 0,
  p_stats: 0,
  createdAt: new Date(),
  updatedAt: new Date()
}
