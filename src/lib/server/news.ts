import { db } from './db'
import { BusinessError, ServerError } from '$lib/utils/errors'
import { NotificationCode } from '$lib/utils/notifications'
import { Prisma, type News } from '@prisma/client'

export async function getNewsById(newsId: string) {
  let news
  try {
    news = await db.news.findUnique({ where: { id: newsId } })
  } catch (err) {
    console.error('Error fetching news by ID:', err)
    throw new ServerError('Error fetching news by ID', err, NotificationCode.DATABASE_ERROR, 500)
  }

  if (!news) return null

  return news
}

export async function addNews(title: string, content: string, authorId: string, categoriesId: string[], tagsId: string[]) {
  try {
    await db.news.create({
      data: {
        title,
        content,
        authorId,
        categories: { connect: categoriesId.map((category) => ({ id: category })) },
        tags: { connect: tagsId.map((tag) => ({ id: tag })) }
      }
    })
  } catch (err) {
    console.error('Failed to add news:', err)
    throw new ServerError('Failed to add news', err, NotificationCode.DATABASE_ERROR, 500)
  }
}

export async function updateNews(newsId: string, news: { title: string; content: string }, categoriesId: string[], tagsId: string[]) {
  try {
    await db.news.update({
      where: { id: newsId },
      data: {
        title: news.title,
        content: news.content,
        categories: { set: categoriesId.map((category) => ({ id: category })) },
        tags: { set: tagsId.map((tag) => ({ id: tag })) }
      }
    })
  } catch (err) {
    console.error('Failed to edit news:', err)
    throw new ServerError('Failed to edit news', err, NotificationCode.DATABASE_ERROR, 500)
  }
}

export async function deleteNews(newsId: string) {
  try {
    await db.news.delete({ where: { id: newsId } })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      console.warn(`News with ID ${newsId} not found`)
      throw new BusinessError('News not found', NotificationCode.NOT_FOUND, 404)
    }
    console.error('Error deleting news:', err)
    throw new ServerError('Error deleting news', err, NotificationCode.DATABASE_ERROR, 500)
  }
}


