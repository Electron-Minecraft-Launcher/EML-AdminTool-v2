import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EnvService } from 'client/app/shared/services/env.service';
import en from 'client/app/shared/language/en';
import { ApiAuthService } from 'client/app/shared/services/api/api-auth.service';
import { CookiesService } from 'client/app/shared/services/cookie.service';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataResponse } from 'client/app/shared/types/response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  l = en
  env: any

  name: string = ''
  password: string = ''

    private getAuth$!: Observable<HttpResponse<DataResponse<{ jwt: string }>>>

  constructor(private router: Router, private title: Title, private envService: EnvService, private apiAuthService: ApiAuthService, private cookiesService: CookiesService) { }

  async ngOnInit() {

    this.envService.get().subscribe({ next: (env) => { this.l = env.language; this.env = env; } })

    this.title.setTitle(this.l.auth.login + ' • ' + this.env.name + ' AdminTool')

    /**
     * Si présence de JWT (cookie)
     *    -> Faire vérifier le JWT
     *       Si JWT invalide
     *          -> Rester à /login
     *       Si JWT valide
     *          -> Aller à /dashboard
     * Si pas de JWT
     *    -> Rester à /login
     */

  }

  async onSubmit() {

    document.querySelector<HTMLElement>('app-loading-splash#login-loading-splash')!.style.display = 'block'
    this.getAuth$ = this.apiAuthService.getAuth(this.name + '', this.password + '')
    this.getAuth$.subscribe(
      {
        next: async (res) => {
          this.cookiesService.setCookie({
            name: 'JWT',
            value: res.body?.data?.jwt + '',
            expireDays: 30,
          })
        },
        error: (err) => {
          document.querySelector<HTMLElement>('app-loading-splash#login-loading-splash')!.style.display = 'none'
        }
      }
    )

  }

}
