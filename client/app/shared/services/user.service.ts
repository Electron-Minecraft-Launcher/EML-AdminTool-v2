import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import en from '../language/en';
import fr from '../language/fr';
import { User } from '../types/user';
import { ApiAdminService } from './api/api-admin.service';
import { ApiEnvService } from './api/api-env.service';
import { CookiesService } from './cookie.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: BehaviorSubject<any> = new BehaviorSubject(null)

  constructor(private apiAdminService: ApiAdminService, private cookiesService: CookiesService) { }

  async init() {
    return await this.reload()
  }

  async reload() {
    if (this.cookiesService.getCookie('JWT')) {
      try {
        const user: User | null | undefined = (await this.apiAdminService.getUser().toPromise())?.body?.data
        if (user && user.name) {
          this.set(user)
          return true
        }
        return true
      } catch (error) {
        return true
      }
    }
    return true
  }

  get(): Observable<any> {
    return this.user.asObservable()
  }

  set(user: User) {
    this.user.next(user)
  }

}
