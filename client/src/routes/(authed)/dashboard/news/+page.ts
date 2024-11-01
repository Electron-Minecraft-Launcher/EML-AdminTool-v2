import { redirect } from '@sveltejs/kit'
import cookiesService from '../../../../services/cookies.service'
import type { PageLoad } from './$types'
import type { News, NewsCategory, NewsTag } from '../../../../../../shared/types/features/news'
import apiNewsService from '../../../../services/api/api-news.service'
import type { User } from '../../../../../../shared/types/features/user'
import apiAdminService from '../../../../services/api/api-admin.service'
import type { File } from '../../../../../../shared/types/features/file'

export const load: PageLoad = async ({ parent }) => {
  let users: User[] = []
  let news: News[] = []
  let categories: NewsCategory[] = []
  let tags: NewsTag[] = []
  let images: File[] = []

  if (!cookiesService.get('JWT')) redirect(300, '/login');
  if (!(await parent()).user.p_news_add) redirect(300, '/dashboard');(await apiAdminService.getUsers()).subscribe({
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
