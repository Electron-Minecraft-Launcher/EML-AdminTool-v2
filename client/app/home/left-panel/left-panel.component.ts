import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApiAuthService } from 'client/app/shared/services/api/api-auth.service';
import { EnvService } from 'client/app/shared/services/env.service';
import en from 'client/app/shared/language/en';
import { CookiesService } from 'client/app/shared/services/cookie.service';
import { UtilsService } from 'client/app/shared/services/utils.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { DefaultResponse } from '_client/app/shared/types/response';

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent implements OnInit {

  l = en
  env: any

  accountDropdownOpen = false

  logout$!: Observable<HttpResponse<DefaultResponse>>

  // TODO: @Output() event for minimizing the left panel

  constructor(private router: Router, private title: Title, private envService: EnvService, private apiAuthService: ApiAuthService, public cookiesService: CookiesService, private utils: UtilsService) { }

  async ngOnInit() {

    this.envService.get().subscribe({ next: (env) => { this.l = env.language; this.env = env; } })

    this.title.setTitle(this.l.auth.login + ' • ' + this.env.name + ' AdminTool')

    document.addEventListener('click', async () => {
      if (this.accountDropdownOpen) {
        document.querySelector<HTMLElement>('.account-dropdown#account-dropdown')!.style.opacity = '0'
        document.querySelector<HTMLElement>('.account-dropdown#account-dropdown')!.style.height = '0'
        await this.utils.sleep(200)
        document.querySelector<HTMLElement>('.account-dropdown#account-dropdown')!.style.display = 'none'
        this.accountDropdownOpen = false
      }
    })

  }

  async onAccountClick() {

    if (!this.accountDropdownOpen) {
      document.querySelector<HTMLElement>('.account-dropdown#account-dropdown')!.style.display = 'block'
      await this.utils.sleep(1)
      document.querySelector<HTMLElement>('.account-dropdown#account-dropdown')!.style.opacity = '1'
      document.querySelector<HTMLElement>('.account-dropdown#account-dropdown')!.style.height = '94px'
      await this.utils.sleep(200)
      this.accountDropdownOpen = true
    }

  }

  async onLogoutClick() {

    this.logout$ = this.apiAuthService.deleteLogout()
    this.logout$.subscribe({
      next: () => {
        this.router.navigate(['/login'])
        this.cookiesService.deleteCookie('JWT')
      },
      error: () => {
        this.router.navigate(['/login'])
        this.cookiesService.deleteCookie('JWT')
      }
    })

  }

}
