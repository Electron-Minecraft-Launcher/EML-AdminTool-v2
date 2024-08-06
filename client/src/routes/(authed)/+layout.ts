import { redirect } from '@sveltejs/kit'
import type { LayoutLoad } from '../$types'
import apiAuthService from '../../services/api/api-auth.service'
import cookiesService from '../../services/cookies.service'
import { user } from '../../services/store'
import { get } from 'svelte/store'

export const load: LayoutLoad = async () => {
  if (cookiesService.get('JWT')) {
    ;(await apiAuthService.getVerify()).subscribe({
      next: (res) => {
        user.set(res.body!.data!.user)
        return { user: res.body!.data!.user }
      },
      error: () => {
        throw redirect(300, '/login')
      }
    })
  } else {
    throw redirect(300, '/login')
  }
  return { user: get(user) }
}
