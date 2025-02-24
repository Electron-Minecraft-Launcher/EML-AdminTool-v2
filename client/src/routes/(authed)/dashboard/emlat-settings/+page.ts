import type { PageLoad } from './$types'
import apiAdminService from '../../../../services/api/api-admin.service'
import cookiesService from '../../../../services/cookies.service'
import { redirect } from '@sveltejs/kit'
import type { EMLAT, VPS } from '../../../../../../shared/types/features/emlat-info'
import type { User } from '../../../../../../shared/types/features/user'
import type { Update } from '../../../../../../shared/types/data/update'
import apiUpdateService from '../../../../services/api/api-update.service'

export const load: PageLoad = async ({ parent }) => {
  let emlat!: EMLAT
  let users!: User[]
  let vps!: VPS

  let update: Update = { currentVersion: '', latestVersion: '', releaseDate: '', logoUrl: '', changelogs: '' }

  if (!cookiesService.get('JWT')) redirect(300, '/login')
  if (!(await parent()).user.admin) redirect(300, '/dashboard')

  ;(await apiAdminService.getAdminTool()).subscribe({
    next: (res) => {
      emlat = res.body.data?.emlat!
      vps = res.body.data?.vps!
      users = res.body.data?.users!
    }
  })

  ;(await apiUpdateService.getUpdate()).subscribe({
    next: (res) => {
      update = res.body.data!
    }
  })

  return { emlat, users, vps, update }
}

