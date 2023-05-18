import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'client/environments/environment';
import { Observable } from 'rxjs';
import { DataResponse } from '../../models/responses/response.model';

@Injectable({
  providedIn: 'root'
})
export class ApiEnvService {

  private apiPath = environment.apiPath

  constructor(private http: HttpClient) { }

  getEnv(): Observable<HttpResponse<DataResponse<any>>> {
    return this.http.get<DataResponse<any>>(this.apiPath + '/env', { observe: 'response' })
  }

}
