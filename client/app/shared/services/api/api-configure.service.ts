import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpUrlEncodingCodec } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { DefaultResponse } from '../../models/responses/response.model';
import { environment } from 'client/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigureService {

  private apiPath = environment.apiPath

  constructor(private http: HttpClient) { }

  getConfigure(): Observable<HttpResponse<DefaultResponse>> {
    return this.http.get<DefaultResponse>(this.apiPath + '/configure', { observe: 'response' })
  }

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

  putDbPassword(password: string, auth: string = ''): Observable<HttpResponse<DefaultResponse>> {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Authorization': auth
      }
    )
    const params = new HttpParams({ fromObject: { password: password }, encoder: new HttpUrlEncodingCodec() })

    return this.http.put<DefaultResponse>(this.apiPath + '/configure/database', params, { headers, observe: 'response' })
  }

  putAdmin(name: string, password: string, auth: string = ''): Observable<HttpResponse<DefaultResponse>> {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Authorization': auth
      }
    )
    const params = new HttpParams({ fromObject: { password: password, name: name }, encoder: new HttpUrlEncodingCodec() })

    return this.http.put<DefaultResponse>(this.apiPath + '/configure/admin', params, { headers, observe: 'response' })
  }

}
