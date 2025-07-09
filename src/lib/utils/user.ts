import { getContext } from 'svelte'
import type { IUser } from './types'
import { currentUser } from '$lib/stores/user'

export default function getUser() {
  const user = getContext<IUser>('user')
  currentUser.set(user)
  return user
}

