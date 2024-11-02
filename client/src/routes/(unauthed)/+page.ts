import type { LayoutLoad } from '../$types'
import cookiesService from '../../services/cookies.service'
import { redirect } from '@sveltejs/kit'

export const load: LayoutLoad = async () => {
  if (cookiesService.get('JWT')) {
    redirect(300, '/dashboard')
  } else {
    if (window.location.pathname != '/register') {
      redirect(300, '/login')
    }
  }
}
