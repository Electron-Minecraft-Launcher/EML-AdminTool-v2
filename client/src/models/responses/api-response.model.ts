export interface HttpResponse<T> {
  readonly headers: Headers
  readonly ok: boolean
  readonly redirected: boolean
  readonly status: number
  readonly statusText: string
  readonly type: ResponseType
  readonly url: string
  readonly body: T
}

export interface Observable<T> {
  subscribe(observe: {
    next?: (resp: HttpResponse<T>) => void
    error?: (resp: HttpResponse<T>) => void
    finally?: (resp: HttpResponse<T>) => void
  }): void
}
