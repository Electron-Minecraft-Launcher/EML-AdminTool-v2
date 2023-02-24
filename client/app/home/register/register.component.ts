import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EnvService } from 'client/app/shared/services/env.service';
import en from 'client/app/shared/language/en';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { DataResponse } from 'client/app/shared/types/response';
import { ApiAuthService } from 'client/app/shared/services/api/api-auth.service';
import { CookiesService } from 'client/app/shared/services/cookie.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  l = en
  env: any

  name: string = ''
  password: string = ''
  passwordCfr: string = ''
  pin: string[] = ['', '', '']

  private putRegister$!: Observable<HttpResponse<DataResponse<{ jwt: string }>>>

  constructor(private router: Router, private title: Title, private envService: EnvService, private apiAuthService: ApiAuthService, private cookiesService: CookiesService) { }

  async ngOnInit() {

    this.envService.get().subscribe({ next: (env) => { this.l = env.language; this.env = env; } })

    this.title.setTitle(this.l.auth.register + ' • ' + this.env.name + ' AdminTool')

  }

  focusNext(e: KeyboardEvent, n: number) {
    var input = document.querySelector<HTMLInputElement>('input#pin-' + n)!
    const i = e.target! as HTMLInputElement
    if (!/^[0-9]+$/.test(input.value) && input.value != '') {
      input.value = ''
      return
    }
    if (input.value.length == 1) {
      var nextInput = document.querySelector<HTMLInputElement>('input#pin-' + (n + 1))
      if (nextInput) {
        nextInput.focus()
      }
      return
    }
    if (e.keyCode == 8 || e.keyCode == 46) {
      if (i.value == '') {
        var previousInput = document.querySelector<HTMLInputElement>('input#pin-' + (n - 1))
        if (previousInput) {
          previousInput.focus()
        }
      }
      return
    }
  }

  async onSubmit() {

    document.querySelector<HTMLElement>('app-loading-splash#register-loading-splash')!.style.display = 'block'
    this.putRegister$ = this.apiAuthService.putRegister(this.name + '', this.password + '', this.pin[0] + '' + this.pin[1] + '' + this.pin[2])
    this.putRegister$.subscribe(
      {
        next: async (res) => {
          this.cookiesService.setCookie({
            name: 'JWT',
            value: res.body?.data?.jwt + '',
            expireDays: 30,
          })
        },
        error: (err) => {
          document.querySelector<HTMLElement>('app-loading-splash#register-loading-splash')!.style.display = 'none'
        }
      }
    )

  }

}

