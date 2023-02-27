import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpUrlEncodingCodec } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
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
    const params = new HttpParams({ fromObject: { language: language }, encoder: new HttpUrlEncodingCodec() })
    return this.http.put<DefaultResponse>(this.apiPath + '/configure/language', params, { observe: 'response' })
  }

  putDbPassword(password: string, auth: string = ''): Observable<HttpResponse<DefaultResponse>> {
    const params = new HttpParams({ fromObject: { password: password }, encoder: new HttpUrlEncodingCodec() })
    return this.http.put<DefaultResponse>(this.apiPath + '/configure/database', params, { observe: 'response' })
  }

  putAdmin(name: string, password: string, auth: string = ''): Observable<HttpResponse<DefaultResponse>> {
    const params = new HttpParams({ fromObject: { password: password, name: name }, encoder: new HttpUrlEncodingCodec() })
    return this.http.put<DefaultResponse>(this.apiPath + '/configure/admin', params, { observe: 'response' })
  }

}