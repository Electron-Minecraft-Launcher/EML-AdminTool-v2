import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import en from '../language/en';
import fr from '../language/fr';
import { ApiEnvService } from './api/api-env.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: BehaviorSubject<any> = new BehaviorSubject(null)
  static set = false

  constructor(private apiEnvService: ApiEnvService) { }

  async init() {
    if (!UserService.set) {
      try {
        const env = (await this.apiEnvService.getEnv().toPromise())?.body?.data
        UserService.set = true
        this.set(env)
        return true
      } catch (error) {
        UserService.set = true
        this.set({
          language: "en",
          name: "EML",
          theme: "eml"
        })
        return true
      }
    }
    return true
  }

  get(): Observable<any> {
    return this.user.asObservable()
  }

  set(env: { language: any, name: string, theme: string }) {
    if (env.language == 'fr') {
      env.language = fr
    } else {
      env.language = en
    }
    this.user.next(env)
  }

}
