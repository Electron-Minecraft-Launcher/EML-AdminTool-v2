import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApiAuthService } from 'client/app/shared/services/api/api-auth.service';
import { EnvService } from 'client/app/shared/services/env.service';
import { CookiesService } from 'client/app/shared/services/cookie.service';
import en from 'client/app/shared/language/en';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  l = en
  env: any

  constructor(private router: Router, private title: Title, private envService: EnvService, private apiAuthService: ApiAuthService, private cookiesService: CookiesService) { }

  async ngOnInit() {

    this.envService.get().subscribe({ next: (env) => { this.l = env.language; this.env = env; } })

    this.title.setTitle(this.l.auth.login + ' • ' + this.env.name + ' AdminTool')
  }

}
