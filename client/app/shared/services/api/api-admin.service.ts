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
export class ApiAdminService {
  private apiPath = environment.apiPath

  constructor(private http: HttpClient) { }

  getUsers(): Observable<HttpResponse<DataResponse<User[]>>> {
    return this.http.get <DataResponse<User[]>>(this.apiPath + '/users', { observe: 'response' })
  }

  getUser(id: number | 'me' = 'me'): Observable<HttpResponse<DataResponse<User>>> {
    return this.http.get<DataResponse<User>>(this.apiPath + '/users/' + id, { observe: 'response' })
  }

  putUser(): Observable<HttpResponse<DataResponse<{ jwt: string, user: User }>>> {
    return this.http.get<DataResponse<{ jwt: string, user: User }>>(this.apiPath + '/verify', { observe: 'response' })
  }

  deleteUser(): Observable<HttpResponse<DefaultResponse>> {
    return this.http.delete<DefaultResponse>(this.apiPath + '/logout', { observe: 'response' })
  }
}
