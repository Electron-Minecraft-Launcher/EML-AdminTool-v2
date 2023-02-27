import { HttpClient, HttpResponse, HttpHeaders, HttpParams, HttpUrlEncodingCodec } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'client/environments/environment';
import { DataResponse, DefaultResponse } from '../../types/response';
import { Buffer } from 'buffer'
import { User } from '../../types/user';

@Injectable({
  providedIn: 'root'
})
export class ApiAuthService {
  private apiPath = environment.apiPath

  constructor(private http: HttpClient) { }

  getAuth(name: string, password: string): Observable<HttpResponse<DataResponse<{ jwt: string, user: User }>>> {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Authorization': 'Basic ' + Buffer.from(name + ':' + password).toString('base64')
      }
    )
    return this.http.get <DataResponse<{ jwt: string, user: User }>>(this.apiPath + '/auth', { headers, observe: 'response' })
  }

  postRegister(name: string, password: string, pin: string): Observable<HttpResponse<DataResponse<{ jwt: string, user: User }>>> {
    const params = new HttpParams({ fromObject: { name: name, password: password, pin: pin }, encoder: new HttpUrlEncodingCodec() })
    return this.http.post<DataResponse<{ jwt: string, user: User }>>(this.apiPath + '/register', params, { observe: 'response' })
  }

  getVerify(): Observable<HttpResponse<DataResponse<{ jwt: string, user: User }>>> {
    return this.http.get<DataResponse<{ jwt: string, user: User }>>(this.apiPath + '/verify', { observe: 'response' })
  }
}
