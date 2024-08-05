import { redirect } from '@sveltejs/kit'
import apiAuthService from '../../../../services/api/api-auth.service'
import cookiesService from '../../../../services/cookies.service'
import { user } from '../../../../services/store'
import type { PageLoad } from './$types'
import type { File, Loader, LoaderVersion } from '../../../../../../shared/models/features/file.model'
import apiFilesUpdaterService from '../../../../services/api/api-filesupdater.service'

export const load: PageLoad = async () => {
  let files: File[] = []
  let loader: Loader = {
    loader: 'vanilla',
    minecraft_version: 'latest_release',
    loader_version: null,
    loader_type: 'client'
  }
  let loadersList: { vanilla: LoaderVersion[]; forge: LoaderVersion[] } = { vanilla: [], forge: [] }

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

  ;(await apiFilesUpdaterService.getLoader()).subscribe({
    next: (res) => {
      loader = res.body!.data!
    }
  })

  return { files, loader, loadersList }
}
