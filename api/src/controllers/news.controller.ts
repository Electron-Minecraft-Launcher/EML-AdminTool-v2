import { Request } from 'express'
import { DataSuccess } from '../responses/success/data-success.response'
import { ResponseType, count } from '../../../shared/models/types'
import { File } from '../../../shared/models/features/file.model'
import filesService from '../services/files.service'
import { IncomingHttpHeaders } from 'http'
import nexter from '../utils/nexter'
import authService from '../services/auth.service'
import { ServiceException } from '../responses/types'
import { UnauthorizedException } from '../responses/exceptions/unauthorized-exception.response'
import db from '../utils/db'
import { DBException } from '../responses/exceptions/db-exception.response'
import { News as News_ } from '../../../shared/models/features/news.model'
import { RequestException } from '../responses/exceptions/request-exception.response'

class News {
  async getNews(req: Request): Promise<DataSuccess<News_[]>> {
    let news: News_[]

    try {
      news = await db.query('SELECT * FROM news')
    } catch (error: any) {
      throw new DBException()
    }

    let news_: News_[] = []

    news.forEach((news) => {
      news_.push({
        id: news.id,
        title: news.title,
        content: news.content,
        author: news.author,
        date: news.date,
        edition_date: news.edition_date,
        categories: JSON.parse(news.categories as string),
        tags: JSON.parse(news.tags as string)
      })
    })

    return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', news_)
  }

  async getNews1(req: Request<any>, newsId: number): Promise<DataSuccess<News_>> {
    let news: News_

    try {
      news = (await db.query<News_[]>('SELECT * FROM news WHERE id = ?', [+newsId]))[0]
    } catch (error: any) {
      throw new DBException()
    }

    if (!news || !news.id) {
      throw new RequestException('News not found')
    }

    return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', news)
  }

  async postNews(req: Request, headers: IncomingHttpHeaders, body: any): Promise<DataSuccess<News_[]>> {
    try {
      var auth = nexter.serviceToException(await authService.checkAuth(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    if (+auth.p_news_add! != 1) {
      throw new UnauthorizedException()
    }

    if (!body.title || !body.content || body.title == '' || body.content == '') {
      throw new RequestException('Missing parameters')
    }

    let categories: number[] = []
    if (body.categories) {
      try {
        categories = JSON.parse(body.categories)
      } catch (error) {
        categories = []
      }

      categories.forEach((category, i) => {
        categories[i] = +category || 0
      })

      categories = categories.filter((category) => category != 0)
    }

    let tags: number[] = []
    if (body.tags) {
      try {
        tags = JSON.parse(body.tags)
      } catch (error) {
        tags = []
      }

      tags.forEach((tag, i) => {
        tags[i] = +tag || 0
      })

      tags = tags.filter((tag) => tag != 0)
    }

    const news: News_ = {
      title: body.title,
      content: body.content,
      author: auth.id!,
      date: new Date(),
      categories: JSON.stringify(categories) || '[]',
      tags: JSON.stringify(tags) || '[]'
    }

    try {
      await db.query('INSERT INTO news (title, content, author, date, categories, tags) VALUES (?, ?, ?, ?, ?, ?)', [
        news.title,
        news.content,
        news.author,
        news.date,
        news.categories,
        news.tags
      ])
    } catch (error) {
      throw new DBException()
    }

    return await this.getNews(req)
  }

  async putNews(req: Request<any>, headers: IncomingHttpHeaders, body: any, newsId: number): Promise<DataSuccess<News_[]>> {
    try {
      var auth = nexter.serviceToException(await authService.checkAuth(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    if (!newsId) {
      throw new RequestException('Missing parameters')
    }

    let news: News_

    try {
      news = (await db.query<News_[]>('SELECT * FROM news WHERE id = ?', [+newsId]))[0]
    } catch (error) {
      throw new DBException()
    }

    if (!news || !news.id) {
      throw new RequestException('News not found')
    }

    if (news.author != auth.id && +auth.p_news_mod_del! != 1) {
      throw new UnauthorizedException()
    } else if (news.author == auth.id && +auth.p_news_add! != 1) {
      throw new UnauthorizedException()
    }

    let categories: number[] = news.categories ? JSON.parse(news.categories as string) : []
    if (body.categories) {
      try {
        categories = JSON.parse(body.categories)
      } catch (error) {
        categories = []
      }

      categories.forEach((category, i) => {
        categories[i] = +category || 0
      })

      categories = categories.filter((category) => category != 0)
    }

    let tags: number[] = news.tags ? JSON.parse(news.tags as string) : []
    if (body.tags) {
      try {
        tags = JSON.parse(body.tags)
      } catch (error) {
        tags = []
      }

      tags.forEach((tag, i) => {
        tags[i] = +tag || 0
      })

      tags = tags.filter((tag) => tag != 0)
    }

    let updatedNews: Partial<News_> = {
      title: body.title && body.title != '' ? body.title : news.title,
      content: body.content && body.content != '' ? body.content : news.content,
      edition_date: new Date(),
      categories: JSON.stringify(categories) || '[]',
      tags: JSON.stringify(tags) || '[]'
    }

    try {
      await db.query('UPDATE news SET title = ?, content = ?, edition_date = ?, categories = ?, tags = ? WHERE id = ?', [
        updatedNews.title,
        updatedNews.content,
        updatedNews.edition_date,
        updatedNews.categories,
        updatedNews.tags,
        newsId
      ])
    } catch (error) {
      throw new DBException()
    }

    return await this.getNews(req)
  }

  async deleteNews(req: Request<any>, headers: IncomingHttpHeaders, newsId: number): Promise<DataSuccess<News_[]>> {
    try {
      var auth = nexter.serviceToException(await authService.checkAuth(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    if (!newsId) {
      throw new RequestException('Missing parameters')
    }

    let news: News_

    try {
      news = (await db.query<News_[]>('SELECT * FROM news WHERE id = ?', [+newsId]))[0]
    } catch (error) {
      throw new DBException()
    }

    if (!news || !news.id) {
      throw new RequestException('News not found')
    }

    if (news.author != auth.id && +auth.p_news_mod_del! != 1) {
      throw new UnauthorizedException()
    } else if (news.author == auth.id && +auth.p_news_add! != 1) {
      throw new UnauthorizedException()
    }

    try {
      await db.query('DELETE FROM news WHERE id = ?', [news.id])
    } catch (error) {
      throw new DBException()
    }

    return await this.getNews(req)
  }
}

export default News
