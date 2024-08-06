import { Request } from 'express'
import { DataSuccess } from '../responses/success/data-success.response'
import { ResponseType, count } from '../../../shared/types/types'
import { File } from '../../../shared/types/features/file'
import filesService from '../services/files.service'
import { IncomingHttpHeaders } from 'http'
import nexter from '../utils/nexter'
import authService from '../services/auth.service'
import { ServiceException } from '../responses/types'
import { UnauthorizedException } from '../responses/exceptions/unauthorized-exception.response'
import db from '../utils/db'
import { DBException } from '../responses/exceptions/db-exception.response'
import { NewsCategory, NewsCategoryRes, NewsTag, News as News_ } from '../../../shared/types/features/news'
import { RequestException } from '../responses/exceptions/request-exception.response'
import { NotFoundException } from '../responses/exceptions/notfound-exception.response'

class News {
  //* News ======================================

  async getNews(req: Request): Promise<DataSuccess<News_[]>> {
    let news: News_[]

    try {
      news = await db.query('SELECT * FROM news ORDER BY date DESC')
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
      throw new NotFoundException('News not found')
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
      throw new NotFoundException('News not found')
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

  //* Categories ================================

  async getCategories(req: Request<any>): Promise<DataSuccess<NewsCategory[]>> {
    let categories: NewsCategory[]

    try {
      categories = await db.query('SELECT * FROM news_categories ORDER BY date DESC')
    } catch (error: any) {
      throw new DBException()
    }

    return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', categories)
  }

  async getCategory(req: Request<any>, categoryId: number): Promise<DataSuccess<NewsCategoryRes>> {
    let category: NewsCategory

    try {
      category = (await db.query<NewsCategory[]>('SELECT * FROM news_categories WHERE id = ?', [+categoryId]))[0]
    } catch (error: any) {
      throw new DBException()
    }

    if (!category || !category.id) {
      throw new NotFoundException('Category not found')
    }

    let news: News_[] = (await this.getNews(req)).data

    let news_: News_[] = news.filter((news1) => (news1.categories! as number[]).includes(category.id!))

    return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', { ...category, news: news_ })
  }

  async postCategory(req: Request<any>, headers: IncomingHttpHeaders, body: any): Promise<DataSuccess<NewsCategory[]>> {
    try {
      var auth = nexter.serviceToException(await authService.checkAuth(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    if (+auth.p_news_categories_add_mod_del! != 1) {
      throw new UnauthorizedException()
    }

    if (!body.title || body.title == '') {
      throw new RequestException('Missing parameters')
    }

    if (!isNaN(+body.title)) {
      throw new RequestException('Invalid parameters')
    }

    try {
      await db.query('INSERT INTO news_categories (title, date) VALUES (?, ?)', [body.title, new Date()])
    } catch (error) {
      throw new DBException()
    }

    return await this.getCategories(req)
  }

  async putCategory(req: Request<any>, headers: IncomingHttpHeaders, body: any, categoryId: number): Promise<DataSuccess<NewsCategory[]>> {
    try {
      var auth = nexter.serviceToException(await authService.checkAuth(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    if (+auth.p_news_categories_add_mod_del! != 1) {
      throw new UnauthorizedException()
    }

    if (!categoryId) {
      throw new RequestException('Missing parameters')
    }

    let category: NewsCategory

    try {
      category = (await db.query<NewsCategory[]>('SELECT * FROM news_categories WHERE id = ?', [+categoryId]))[0]
    } catch (error: any) {
      throw new DBException()
    }

    if (!category || !category.id) {
      throw new NotFoundException('Category not found')
    }

    try {
      await db.query('UPDATE news_categories SET title = ? WHERE id = ?', [body.title && body.title != '' ? body.title : category.title, categoryId])
    } catch (error) {
      throw new DBException()
    }

    return await this.getCategories(req)
  }

  async deleteCategory(req: Request<any>, headers: IncomingHttpHeaders, categoryId: number): Promise<DataSuccess<NewsCategory[]>> {
    try {
      var auth = nexter.serviceToException(await authService.checkAuth(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    if (+auth.p_news_categories_add_mod_del! != 1) {
      throw new UnauthorizedException()
    }

    if (!categoryId) {
      throw new RequestException('Missing parameters')
    }

    let category: NewsCategory

    try {
      category = (await db.query<NewsCategory[]>('SELECT * FROM news_categories WHERE id = ?', [+categoryId]))[0]
    } catch (error: any) {
      throw new DBException()
    }

    if (!category || !category.id) {
      throw new NotFoundException('Category not found')
    }

    try {
      await db.query('DELETE FROM news_categories WHERE id = ?', [category.id])
    } catch (error) {
      throw new DBException()
    }

    return await this.getCategories(req)
  }

  //* Tags ======================================

  async getTags(req: Request<any>): Promise<DataSuccess<NewsTag[]>> {
    let tags: NewsTag[]

    try {
      tags = await db.query('SELECT * FROM news_tags ORDER BY title ASC')
    } catch (error: any) {
      throw new DBException()
    }

    return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', tags)
  }

  async getTag(req: Request<any>, tagId: number): Promise<DataSuccess<NewsTag>> {
    let tag: NewsTag

    try {
      tag = (await db.query<NewsTag[]>('SELECT * FROM news_tags WHERE id = ?', [+tagId]))[0]
    } catch (error: any) {
      throw new DBException()
    }

    if (!tag || !tag.id) {
      throw new NotFoundException('Tag not found')
    }

    return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', tag)
  }

  async postTag(req: Request<any>, headers: IncomingHttpHeaders, body: any): Promise<DataSuccess<NewsTag[]>> {
    try {
      var auth = nexter.serviceToException(await authService.checkAuth(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    if (+auth.p_news_tags_add_mod_del! != 1) {
      throw new UnauthorizedException()
    }

    if (!body.title || body.title == '' || !body.color || body.color == '') {
      throw new RequestException('Missing parameters')
    }

    if (!isNaN(+body.title)) {
      throw new RequestException('Invalid parameters')
    }

    try {
      await db.query('INSERT INTO news_tags (title, color) VALUES (?, ?)', [body.title, body.color])
    } catch (error) {
      throw new DBException()
    }

    return await this.getTags(req)
  }

  async putTag(req: Request<any>, headers: IncomingHttpHeaders, body: any, tagId: number): Promise<DataSuccess<NewsTag[]>> {
    try {
      var auth = nexter.serviceToException(await authService.checkAuth(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    if (+auth.p_news_tags_add_mod_del! != 1) {
      throw new UnauthorizedException()
    }

    if (!tagId) {
      throw new RequestException('Missing parameters')
    }

    let tag: NewsTag

    try {
      tag = (await db.query<NewsTag[]>('SELECT * FROM news_tags WHERE id = ?', [+tagId]))[0]
    } catch (error: any) {
      throw new DBException()
    }

    if (!tag || !tag.id) {
      throw new NotFoundException('Tag not found')
    }

    const updatedTag: NewsTag = {
      title: body.title && body.title != '' ? body.title : tag.title,
      color: body.color && body.color != '' ? body.color : tag.color
    }

    try {
      await db.query('UPDATE news_tags SET title = ?, color = ? WHERE id = ?', [updatedTag.title, updatedTag.color, tagId])
    } catch (error) {
      throw new DBException()
    }

    return await this.getTags(req)
  }

  async deleteTag(req: Request<any>, headers: IncomingHttpHeaders, tagId: number): Promise<DataSuccess<NewsTag[]>> {
    try {
      var auth = nexter.serviceToException(await authService.checkAuth(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    if (+auth.p_news_tags_add_mod_del! != 1) {
      throw new UnauthorizedException()
    }

    if (!tagId) {
      throw new RequestException('Missing parameters')
    }

    let tag: NewsTag

    try {
      tag = (await db.query<NewsTag[]>('SELECT * FROM news_tags WHERE id = ?', [+tagId]))[0]
    } catch (error: any) {
      throw new DBException()
    }

    if (!tag || !tag.id) {
      throw new NotFoundException('Tag not found')
    }

    try {
      await db.query('DELETE FROM news_tags WHERE id = ?', [tag.id])
    } catch (error) {
      throw new DBException()
    }

    return await this.getTags(req)
  }

  //* Images ====================================

  async getImages(req: Request<any>): Promise<DataSuccess<File[]>> {
    let images: File[]

    try {
      images = await filesService.get(req, 'images')
    } catch (error: any) {
      throw new DBException()
    }

    return new DataSuccess(req, 200, ResponseType.SUCCESS, 'Success', images)
  }

  async uploadImage(req: Request<any>): Promise<DataSuccess<File[]>> {
    return await this.getImages(req)
  }

  async deleteImage(req: Request<any>, headers: IncomingHttpHeaders, body: any): Promise<DataSuccess<File[]>> {
    try {
      var auth = nexter.serviceToException(await authService.checkAuth(headers['authorization'] + ''))
    } catch (error: unknown) {
      throw error as ServiceException
    }

    if (+auth.p_news_mod_del! != 1) {
      throw new UnauthorizedException()
    }

    if (!body.paths) {
      throw new RequestException('Missing parameters')
    }

    try {
      body.paths = JSON.parse(body.paths)
    } catch (error) {
      throw new RequestException('Invalid parameters')
    }

    if (body.paths.length == 0) {
      throw new RequestException('Missing parameters')
    }

    try {
      filesService.delete('images', body.paths)
    } catch (error: any) {
      throw new DBException()
    }

    return await this.getImages(req)
  }
}

export default News
