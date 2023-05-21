import type { Observable, HttpResponse } from '$models/responses/api-response.model'
import type { DefaultHttpResponse } from '$models/responses/default-http-response.model'
import CookiesService from './cookies.service'
import NotificationsService from './notifications.service'
import router from './router'

const cookies = new CookiesService()
const notification = new NotificationsService()

class Http {
  private headers: HeadersInit = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }

  async get<T extends DefaultHttpResponse>(url: string, req?: RequestInit) {
    return this.sendRequest<T>(url, 'GET', req)
  }

  async post<T extends DefaultHttpResponse>(url: string, body?: any, req?: RequestInit) {
    return this.sendRequest<T>(url, 'POST', req, body)
  }

  async put<T extends DefaultHttpResponse>(url: string, body?: any, req?: RequestInit) {
    return this.sendRequest<T>(url, 'PUT', req, body)
  }

  async delete<T extends DefaultHttpResponse>(url: string, body?: any, req?: RequestInit) {
    return this.sendRequest<T>(url, 'DELETE', req, body)
  }

  private sendRequest<T extends DefaultHttpResponse>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    req: RequestInit = {},
    body: any = {}
  ): Promise<Observable<T>> {
    return fetch(url, this.setRequest(url, method, req, body))
      .then(async (response: Response) => {
        return { response: response, body: (await response.json()) as unknown }
      })
      .then((response) => {
        return { response: response.response, body: response.body as T }
      })
      .then((response) => {
        this.responseInterceptor(response, url)
        return this.setResponse(response)
      })
  }

  private setRequest(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', req?: RequestInit, body?: any): RequestInit {
    this.sendInterceptor(url)

    let req_: RequestInit = {
      ...req,
      method: method,
      headers: {
        ...this.headers,
        ...req?.headers,
      },
      body: this.urlEncode(body) + '',
    }

    if (method == 'GET') {
      delete req_.body
    }

    return req_
  }

  private setResponse<T>(response: { response: Response; body: T }): Observable<T> {
    const resp = {
      headers: response.response.headers,
      ok: response.response.ok,
      redirected: response.response.redirected,
      status: response.response.status,
      statusText: response.response.statusText,
      type: response.response.type,
      url: response.response.url,
      body: response.body,
    }
    return {
      subscribe(observe: {
        next?: (resp: HttpResponse<T>) => void
        error?: (resp: HttpResponse<T>) => void
        finally?: (resp: HttpResponse<T>) => void
      }): void {
        if (resp.ok && observe.next) {
          observe.next(resp)
        } else if (observe.error) {
          observe.error(resp)
        }
        if (observe.finally) {
          observe.finally(resp)
        }
      },
    }
  }

  private urlEncode(object: any): string {
    var formBody = []
    for (var property in object) {
      var encodedKey = encodeURIComponent(property)
      var encodedValue = encodeURIComponent(object[property])
      formBody.push(encodedKey + '=' + encodedValue)
    }
    return formBody.join('&')
  }

  private sendInterceptor(url: string): void {
    if (!url.includes('/auth') && !url.includes('/register')) {
      this.headers = { ...this.headers, ...{ Authorization: 'Bearer ' + cookies.get('JWT') } }
    }
  }

  private responseInterceptor<T extends DefaultHttpResponse>(response: { response: Response; body: T }, url: string): void {
    // const urls = ['/configure/', '/verify', '/logout', '/users/me']

    if (!url.includes('/env') && response.body.code == 'CONFIG_ERROR') {
      cookies.delete('JWT')
      router.goto('/configure')
    }

    if (response.body.code == 'AUTH_ERROR') {
      if (url.includes('/auth') || url.includes('/register')) {
        notification.update({ type: 'ERROR', code: 'auth' })
      } else if (
        url.includes('/configure/') ||
        url.includes('/verify') ||
        url.includes('/logout') ||
        url.includes('/users/me') ||
        response.body.message == 'Token expired'
      ) {
        cookies.delete('JWT')
        notification.update({ type: 'ERROR', code: 'login' })
        router.goto('/login')
      } else {
        notification.update({ type: 'ERROR', code: 'permission' })
        router.goto('/dashboard')
      }
    }
  }
}

export default new Http()
