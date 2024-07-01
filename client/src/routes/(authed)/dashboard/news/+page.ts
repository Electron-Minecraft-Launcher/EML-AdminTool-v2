import { redirect } from '@sveltejs/kit'
import apiAuthService from '../../../../services/api/api-auth.service'
import cookiesService from '../../../../services/cookies.service'
import { user } from '../../../../services/store'
import type { PageLoad } from './$types'
import type { News, NewsCategory, NewsTag } from '../../../../../../shared/models/features/news.model'
import apiNewsService from '../../../../services/api/api-news.service'
import type { User } from '../../../../../../shared/models/features/user.model'
import apiAdminService from '../../../../services/api/api-admin.service'
import type { File } from '../../../../../../shared/models/features/file.model'

export const load: PageLoad = async () => {
  let users: User[] = []
  let news: News[] = []
  let categories: NewsCategory[] = []
  let tags: NewsTag[] = []
  let images: File[] = []

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

  ;(await apiAdminService.getUsers()).subscribe({
    next: (res) => {
      users = res.body.data!
    }
  })
  ;(await apiNewsService.getNews()).subscribe({
    next: (res) => {
      news = res.body.data!
    }
  })
  ;(await apiNewsService.getCategories()).subscribe({
    next: (res) => {
      categories = res.body.data!
    }
  })
  ;(await apiNewsService.getTags()).subscribe({
    next: (res) => {
      tags = res.body.data!
    }
  })
  ;(await apiNewsService.getImages()).subscribe({
    next: (res) => {
      images = res.body.data!
    }
  })

  return { users, news, categories, tags, images }
}
