import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApiAuthService } from 'client/app/shared/services/api/api-auth.service';
import { EnvService } from 'client/app/shared/services/env.service';
import en from 'client/app/shared/language/en';
import { CookiesService } from 'client/app/shared/services/cookie.service';

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent implements OnInit {

  l = en
  env: any

  // TODO: @Output() event for minimizing the left panel

  constructor(private router: Router, private title: Title, private envService: EnvService, private apiAuthService: ApiAuthService, public cookiesService: CookiesService) { }

  async ngOnInit() {

    this.envService.get().subscribe({ next: (env) => { this.l = env.language; this.env = env; } })

    this.title.setTitle(this.l.auth.login + ' • ' + this.env.name + ' AdminTool')
  }

}
