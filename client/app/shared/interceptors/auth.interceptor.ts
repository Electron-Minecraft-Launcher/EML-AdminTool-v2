import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'
import { Router } from '@angular/router';
import { CookiesService } from '../services/cookie.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private cookiesService: CookiesService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.url.includes('/auth') || req.url.includes('/register')) {
      return next.handle(req)
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
          this.router.navigate(['/login'])
          this.cookiesService.deleteCookie('JWT')
        }
        return throwError(() => new Error(err))
      })
    )

  }

}
