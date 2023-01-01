import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpUrlEncodingCodec } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { DefaultResponse } from '../../types/response';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigureService {

  private apiPath: '/api' = '/api'

  constructor(private http: HttpClient) { }

  putLanguage(language: string, auth: string = ''): Observable<HttpResponse<DefaultResponse>> {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Authorization': auth
      }
    )
    const params = new HttpParams({ fromObject: { language: language }, encoder: new HttpUrlEncodingCodec() })

    return this.http.put<DefaultResponse>(this.apiPath + '/configure/language', params, { headers, observe: 'response' })
  }

}
