import { redirect } from '@sveltejs/kit'
import apiAuthService from '../../../../services/api/api-auth.service'
import cookiesService from '../../../../services/cookies.service'
import { user } from '../../../../services/store'
import type { PageLoad } from './$types'
import type { File } from '../../../../../../shared/models/features/filesupdater.model'
import apiFilesUpdaterService from '../../../../services/api/api-filesupdater.service'

export const load: PageLoad = async () => {
  let files: File[] = []

  if (cookiesService.get('JWT')) {
    ;(await apiAuthService.getVerify()).subscribe({
      next: (res) => {
        user.set(res.body!.data!.user)
        if (res.body!.data!.user.p_files_updater_add_del != 1) {
          throw redirect(300, '/dashboard')
        }
      }
    })
  } else {
    throw redirect(300, '/login')
  }

  return { files }
}
