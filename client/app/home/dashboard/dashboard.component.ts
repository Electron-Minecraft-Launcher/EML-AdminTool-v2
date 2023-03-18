import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApiAuthService } from 'client/app/shared/services/api/api-auth.service';
import { EnvService } from 'client/app/shared/services/env.service';
import { CookiesService } from 'client/app/shared/services/cookie.service';
import en from 'client/app/shared/language/en';
import { User } from 'client/app/shared/types/user';
import { UserService } from 'client/app/shared/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  l = en
  env: any
  user!: User

  constructor(private router: Router, private title: Title, private envService: EnvService, private userService: UserService, private apiAuthService: ApiAuthService, private cookiesService: CookiesService) { }

  async ngOnInit() {

    this.userService.get().subscribe({ next: (user) => this.user = user })
    this.envService.get().subscribe({ next: (env) => { this.l = env.language; this.env = env; } })

    this.title.setTitle(this.env.name + ' AdminTool')
  }

}
