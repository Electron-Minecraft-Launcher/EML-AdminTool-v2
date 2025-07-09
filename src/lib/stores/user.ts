import { writable, derived, type Readable } from 'svelte/store'
import type { IUser } from '$lib/utils/types'

export const currentUser = writable<IUser>()

export const user: Readable<IUser> = derived(currentUser, ($currentUser) => {
  return $currentUser
})
