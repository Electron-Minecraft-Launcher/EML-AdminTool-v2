import { HttpClient } from '@angular/common/http';
import { EventEmitter, Inject, Injectable } from '@angular/core';
import { environment } from 'client/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import en from '../language/en'
import fr from '../language/fr'
import { ApiEnvService } from './api/api-env.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  // static language: any = en
  // static set = false

  // constructor(private http: HttpClient, private apiEnvService: ApiEnvService) {
  //   this.get()
  // }

  // async get(): Promise<any> {

  //   if (!LanguageService.set) {
  //     try {
  //       const language = (await this.apiEnvService.getEnv().toPromise())?.body?.data.language
  //       LanguageService.set = true
  //       return this.set(language)
  //     } catch (error) {
  //       LanguageService.set = true
  //       return this.set('en')
  //     }
  //   } else {
  //     return LanguageService.language
  //   }
  // }

  // set(l: string): any {
  //   if (l == 'fr') {
  //     LanguageService.language = fr
  //     return fr
  //   } else {
  //     LanguageService.language = en
  //     return en
  //   }
  // }


  private l: BehaviorSubject<any> = new BehaviorSubject(null)
  static set = false

  constructor(private apiEnvService: ApiEnvService) {}

  async init() {
    if (!LanguageService.set) {
      try {
        const language = (await this.apiEnvService.getEnv().toPromise())?.body?.data.language
        LanguageService.set = true
        this.set(language)
        return true
      } catch (error) {
        LanguageService.set = true
        this.set('en')
        return true
      }
    }
    return true
  }

  get(): Observable<any> {
    return this.l.asObservable()
  }

  set(language: 'fr' | string) {
    if (language == 'fr') {
      this.l.next(fr)
    } else {
      this.l.next(en)
    }
  }

}
