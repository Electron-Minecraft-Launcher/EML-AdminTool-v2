import type { Observable, HttpResponse } from '../../../shared/models/responses/services/api-response.model'
import type { DefaultHttpResponse } from '../../../shared/models/responses/http/default-http-response.model'
import { redirect } from '@sveltejs/kit'
import cookiesService from './cookies.service'
import notificationsService from './notifications.service'
import router from './router'
import { goto } from '$app/navigation'

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
        this.responseInterceptor(response, url, method)
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
        } else if (!resp.ok && observe.error) {
          observe.error(resp)
        }
        if (observe.finally) {
          observe.finally(resp)
        }
      },
    }
  }

  private urlEncode(object: any): string {
    var formBody: string[] = []
    for (var property in object) {
      var encodedKey = encodeURIComponent(property)
      var encodedValue = encodeURIComponent(object[property])
      formBody.push(encodedKey + '=' + encodedValue)
    }
    return formBody.join('&')
  }

  private sendInterceptor(url: string): void {
    if (!url.includes('/auth') && !url.includes('/register')) {
      this.headers = { ...this.headers, ...{ Authorization: 'Bearer ' + cookiesService.get('JWT') } }
    }
  }

  private responseInterceptor<T extends DefaultHttpResponse>(
    response: { response: Response; body: T },
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  ): void {
    if (!url.includes('/env') && !url.includes('/configure') && response.body.code == 'CONFIG_ERROR') {
      cookiesService.delete('JWT')
      goto('/configure')
    }

    if (response.body.code == 'AUTH_ERROR') {
      if (url.includes('/auth') || url.includes('/register')) {
        notificationsService.update({ type: 'ERROR', code: 'auth' })
      } else if (
        url.includes('/configure/') ||
        url.includes('/verify') ||
        url.includes('/logout') ||
        (url.includes('/users/me') && method == 'GET') ||
        response.body.message == 'Token expired'
      ) {
        cookiesService.delete('JWT')
        notificationsService.update({ type: 'ERROR', code: 'login' })
        throw redirect(300, '/login')
      } else if (response.body.message == 'Name used') {
        notificationsService.update({ type: 'ERROR', code: 'auth' })
        // notification.update({ type: 'ERROR', code: 'permission' })
        // throw redirect(300, '/dashboard')
      }
    } else if (response.body.code == 'DATABASE_ERROR') {
      notificationsService.update({ type: 'ERROR', code: 'db' })
    }
  }
}

export default new Http()
