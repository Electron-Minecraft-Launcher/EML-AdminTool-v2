import type { Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { logout } from '$lib/server/auth'
import { deleteSession } from '$lib/server/jwt'

export const load = (async (event) => {
  return {}
}) satisfies PageServerLoad

export const actions: Actions = {
  logout: async (event) => {
    const session = event.cookies.get('session') ?? ''

    try {
      await logout(session)
      deleteSession(event)
    } catch (err) {
      console.error('Failed to logout:', err)
      event.cookies.delete('session', { path: '/' })
    }
  }
}