import type { PageLoad } from './$types'
import apiAuthService from '../../../services/api/api-auth.service'
import cookiesService from '../../../services/cookies.service'
import { user } from '../../../services/store'
import { redirect } from '@sveltejs/kit'

export const load: PageLoad = async () => {
  
}
