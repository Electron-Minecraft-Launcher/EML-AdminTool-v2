import { error, fail, redirect, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { BusinessError, ServerError } from '$lib/utils/errors'
import { NotificationCode } from '$lib/utils/notifications'
import { db } from '$lib/server/db'
import { getFiles } from '$lib/server/files'
import { newsSchema } from '$lib/utils/validations'
import { addNews, deleteNews, getNewsById, updateNews } from '$lib/server/news'

export const load = (async (event) => {
  const domain = event.url.origin
  const user = event.locals.user

  if (!user?.p_news) {
    throw redirect(303, '/dashboard')
  }

  let news, newsCategories, newsTags, images

  try {
    try {
      news = await db.news.findMany({
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { id: true, username: true } }, categories: true, tags: true }
      })
    } catch (err) {
      console.error('Failed to load news:', err)
      throw new ServerError('Failed to load news', err, NotificationCode.DATABASE_ERROR, 500)
    }

    try {
      newsCategories = await db.newsCategory.findMany({ orderBy: { name: 'asc' } })
    } catch (err) {
      console.error('Failed to load news categories:', err)
      throw new ServerError('Failed to load news categories', err, NotificationCode.DATABASE_ERROR, 500)
    }

    try {
      newsTags = await db.newsTag.findMany({ orderBy: { name: 'asc' } })
    } catch (err) {
      console.error('Failed to load news tags:', err)
      throw new ServerError('Failed to load news tags', err, NotificationCode.DATABASE_ERROR, 500)
    }

    images = await getFiles(domain, 'images')

    return { news, newsCategories, newsTags, images }
  } catch (err) {
    if (err instanceof ServerError) throw error(err.httpStatus, { message: err.code })

    console.error('Unknown error:', err)
    throw error(500, { message: NotificationCode.INTERNAL_SERVER_ERROR })
  }
}) satisfies PageServerLoad

export const actions: Actions = {
  addEditNews: async (event) => {
    const user = event.locals.user

    if (!user?.p_news) {
      throw redirect(303, '/dashboard')
    }

    const form = await event.request.formData()
    const raw = {
      newsId: form.get('news-id'),
      title: form.get('title'),
      content: form.get('content'),
      categoriesId: form.getAll('categories'),
      tagsId: form.getAll('tags')
    }

    const result = newsSchema.safeParse(raw)
    if (!result.success) {
      return fail(400, { failure: JSON.parse(result.error.message)[0].message })
    }

    const { newsId, title, content, categoriesId, tagsId } = result.data

    try {
      if (newsId) {
        const news = await getNewsById(newsId)
        if (!news) {
          console.warn(`News with ID ${newsId} not found`)
          throw new BusinessError('News not found', NotificationCode.NOT_FOUND, 404)
        }

        if (user.id !== news.id) {
          throw new BusinessError('You are not the author of this news', NotificationCode.FORBIDDEN, 403)
        }

        await updateNews(newsId, { title, content }, categoriesId ?? [], tagsId ?? [])
      } else {
        await addNews(title, content, user.id, categoriesId ?? [], tagsId ?? [])
      }
    } catch (err) {
      if (err instanceof BusinessError) return fail(err.httpStatus, { failure: err.code })
      if (err instanceof ServerError) throw error(err.httpStatus, { message: err.code })

      console.error('Unknown error:', err)
      throw error(500, { message: NotificationCode.INTERNAL_SERVER_ERROR })
    }
  },

  deleteNews: async (event) => {
    const user = event.locals.user

    if (!user?.p_news) {
      throw redirect(303, '/dashboard')
    }

    const form = await event.request.formData()
    const newsId = form.getAll('news-id')

    try {
      for (const id of newsId) {
        if (typeof id !== 'string') continue

        const news = await getNewsById(id)
        if (!news) {
          console.warn(`News with ID ${newsId} not found`)
          throw new BusinessError('News not found', NotificationCode.NOT_FOUND, 404)
        }

        if (user.id !== news.authorId && !user.isAdmin && user.p_news !== 2) {
          throw new BusinessError('You are not the author of this news', NotificationCode.FORBIDDEN, 403)
        }

        await deleteNews(id)
      }
    } catch (err) {
      if (err instanceof BusinessError) return fail(err.httpStatus, { failure: err.code })
      if (err instanceof ServerError) throw error(err.httpStatus, { message: err.code })

      console.error('Unknown error:', err)
      throw error(500, { message: NotificationCode.INTERNAL_SERVER_ERROR })
    }
  }
}

