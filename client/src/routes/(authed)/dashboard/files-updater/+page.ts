import { redirect } from '@sveltejs/kit'
import cookiesService from '../../../../services/cookies.service'
import type { PageLoad } from './$types'
import type { File, Loader, LoaderVersion } from '../../../../../../shared/types/features/file'
import apiFilesUpdaterService from '../../../../services/api/api-filesupdater.service'

export const load: PageLoad = async ({ parent }) => {
  let files: File[] = []
  let loader: Loader = { loader: 'vanilla', minecraft_version: 'latest_release', loader_version: null, loader_type: 'client' }
  let loadersList: { vanilla: LoaderVersion[]; forge: LoaderVersion[] } = { vanilla: [], forge: [] }

  if (!cookiesService.get('JWT')) redirect(300, '/login')
  if (!(await parent()).user.p_files_updater_add_del) redirect(300, '/dashboard')
    
  ;(await apiFilesUpdaterService.getLoader()).subscribe({
    next: (res) => {
      loader = res.body!.data!
    }
  })

  return { files, loader, loadersList }
}
