import { EventEmitter, Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'
import { Router } from '@angular/router';
import { CookiesService } from '../services/cookie.service';
import { NotificationsService } from '../services/notifications.service';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private cookiesService: CookiesService, private notificationService: NotificationsService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.url.includes('/auth') || req.url.includes('/register')) {
      return next.handle(req).pipe(
        catchError(err => {
          if (err.error.code == 'AUTH_ERROR' && req.url.includes('/auth')) {
            this.notificationService.set({ type: 'ERROR', code: 'auth' })
          }
          return throwError(() => new Error(err))
        })
      )
    }

    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Authorization': this.cookiesService.getCookie('JWT') ? 'Bearer ' + this.cookiesService.getCookie('JWT') : ''
    }

    return next.handle(
      req.clone({
        setHeaders: headers
      })
    ).pipe(
      catchError(err => {
        if (err.error.code == 'AUTH_ERROR') {
          if (req.url.includes('/configure/') || req.url.includes('/verify') || req.url.includes('/logout') || req.url.includes('/users/me') || err.error.message == 'Token expired') {
            this.router.navigate(['/login'])
            this.cookiesService.deleteCookie('JWT')
            this.notificationService.set({ type: 'ERROR', code: 'login' })
          } else {
            this.notificationService.set({ type: 'ERROR', code: 'permission' })
            this.router.navigate(['/dashboard'])
          }
        }
        return throwError(() => new Error(err))
      })
    )

  }

}
