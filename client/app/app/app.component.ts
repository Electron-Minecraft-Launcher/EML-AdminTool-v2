import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthInterceptor } from '../shared/interceptors/auth.interceptor';
import { ApiAuthService } from '../shared/services/api/api-auth.service';
import { ApiConfigureService } from '../shared/services/api/api-configure.service';
import { CookiesService } from '../shared/services/cookie.service';
import { EnvService } from '../shared/services/env.service';
import { JwtService } from '../shared/services/jwt.service';
import { NotificationsService } from '../shared/services/notifications.service';
import { UtilsService } from '../shared/services/utils.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  ready1 = false
  ready2 = false
  ready3 = false
  ready = this.ready1 && this.ready2 && this.ready3
  currentRoute = ''
  notification: {
    type: null | 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR',
    content: string
  } = { type: null, content: '' }

  constructor(private envService: EnvService, private apiConfigureService: ApiConfigureService, private apiAuthService: ApiAuthService, private cookiesService: CookiesService, private router: Router, private notificationService: NotificationsService, private utils: UtilsService) { }

  async ngOnInit() {

    this.ready1 = await this.envService.init()
    this.ready = this.ready1 && this.ready2

    this.apiConfigureService.getConfigure().subscribe({
      next: (res) => {
        this.ready2 = true
        this.ready = this.ready1 && this.ready2 && this.ready3
      },
      error: (err) => {
        this.ready2 = true
        this.ready = this.ready1 && this.ready2 && this.ready3
      }
    })

    if (this.cookiesService.getCookie('JWT')) {
      this.apiAuthService.getVerify().subscribe({
        next: (res) => {
          if (this.router.url == '/' || this.router.url == '/login' || this.router.url == '/register') {
            this.router.navigate(['/dashboard'])
          }
          this.ready3 = true
          this.ready = this.ready1 && this.ready2 && this.ready3
        },
        error: (err) => {
          this.ready3 = true
          this.ready = this.ready1 && this.ready2 && this.ready3
        }
      })
    } else {
      this.ready3 = true
      this.ready = this.ready1 && this.ready2 && this.ready3
      this.router.navigate(['/login'])
    }

    this.notificationService.get().subscribe(async (o?: { type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR', code: string }) => {
      this.notification.type = null
      await this.utils.sleep(50)
      if (o) {
        this.notification.type = o.type
        if (o.code == 'login') {
          this.notification.content = 'Please log in again.'
        } else if (o.code == 'auth') {
          this.notification.content = 'Wrong username or password.'
        } else if (o.code == 'permission') {
          this.notification.content = 'You are not allowed to join this page.'
        }
      }
    })


  }

}
