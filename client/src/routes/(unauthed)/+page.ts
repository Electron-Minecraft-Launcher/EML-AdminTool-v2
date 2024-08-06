import type { LayoutLoad } from '../$types'
import cookiesService from '../../services/cookies.service'
import { redirect } from '@sveltejs/kit'

export const load: LayoutLoad = async () => {
  if (cookiesService.get('JWT')) {
    throw redirect(300, '/dashboard')
  } else {
    if (window.location.pathname != '/register') {
      throw redirect(300, '/login')
    }
  }
}
