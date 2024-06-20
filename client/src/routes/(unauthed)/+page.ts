import type { LayoutLoad } from '../$types'
import apiAuthService from '../../services/api/api-auth.service'
import cookiesService from '../../services/cookies.service'
import { redirect } from '@sveltejs/kit'

export const load: LayoutLoad = async () => { 
  if (cookiesService.get('JWT')) {
    ;(await apiAuthService.getVerify()).subscribe({
      next: () => {
        throw redirect(300, '/dashboard')
      },
    })
  } else {
    if (window.location.pathname != '/register') {
      throw redirect(300, '/login')
    }
  }

  return {}
}
