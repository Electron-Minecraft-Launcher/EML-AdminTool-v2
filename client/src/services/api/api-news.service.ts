import http from '../http.module'
import type { DataHttpResponse } from '../../../../shared/models/responses/http/data-http-response.model'
import type { News, NewsCategory, NewsCategoryRes, NewsTag } from '../../../../shared/models/features/news.model'
import type { File as File_ } from '../../../../shared/models/features/file.model'

class ApiNewsService {
  //* News ======================================

  async getNews() {
    return await http.get<DataHttpResponse<News[]>>('/api/news')
  }

  async getNews1(id: number) {
    return await http.get<DataHttpResponse<News>>('/api/news/' + id)
  }

  async postNews(news: Partial<News>) {
    news.categories = JSON.stringify(news.categories)
    news.tags = JSON.stringify(news.tags)
    return await http.post<DataHttpResponse<News[]>>('/api/news', news)
  }

  async putNews(id: number, news: Partial<News>) {
    news.categories = JSON.stringify(news.categories)
    news.tags = JSON.stringify(news.tags)
    return await http.put<DataHttpResponse<News[]>>('/api/news/' + id, news)
  }

  async deleteNews(id: number) {
    return await http.delete<DataHttpResponse<News[]>>('/api/news/' + id)
  }

  //* Categories ================================

  async getCategories() {
    return await http.get<DataHttpResponse<NewsCategory[]>>('/api/news/categories')
  }

  async getCategory(id: number) {
    return await http.get<DataHttpResponse<NewsCategoryRes>>('/api/news/categories/' + id)
  }

  async postCategory(category: NewsCategory) {
    return await http.post<DataHttpResponse<NewsCategory[]>>('/api/news/categories', category)
  }

  async putCategory(id: number, category: NewsCategory) {
    return await http.put<DataHttpResponse<NewsCategory[]>>('/api/news/categories/' + id, category)
  }

  async deleteCategory(id: number) {
    return await http.delete<DataHttpResponse<NewsCategory[]>>('/api/news/categories/' + id)
  }

  //* Tags ======================================

  async getTags() {
    return await http.get<DataHttpResponse<NewsTag[]>>('/api/news/tags')
  }

  async getTag(id: number) {
    return await http.get<DataHttpResponse<NewsTag>>('/api/news/tags/' + id)
  }

  async postTag(tag: NewsTag) {
    return await http.post<DataHttpResponse<NewsTag[]>>('/api/news/tags', tag)
  }

  async putTag(id: number, tag: NewsTag) {
    return await http.put<DataHttpResponse<NewsTag[]>>('/api/news/tags/' + id, tag)
  }

  //* Images ====================================

  async getImages() {
    return await http.get<DataHttpResponse<File_[]>>('/api/news/images')
  }

  async uploadImages(files: File[]) {
    let body = new FormData()
    console.log(files.length, files)
    for (let i = 0; i < files.length; i++) {
      body.append('files[]', files[i])
    }
    return await http.post<DataHttpResponse<File_[]>>('/api/news/images', body)
  }

  async deleteImages(paths: string[]) {
    return await http.delete<DataHttpResponse<File_[]>>('/api/news/images', { paths: JSON.stringify(paths) })
  }
}

export default new ApiNewsService()
