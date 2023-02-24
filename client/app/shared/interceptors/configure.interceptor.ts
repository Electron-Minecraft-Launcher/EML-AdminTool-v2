import { Injectable } from '@angular/core';
import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'
import { Router } from '@angular/router';

@Injectable()
export class ConfigureInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.url.includes('/env')) {
      return next.handle(req)
    }

    return next.handle(req).pipe(
      tap(res => {
        if (res.type === HttpEventType.Response) {
          if (res.body.code == 'CONFIG_ERROR') {
            this.router.navigate(['/configure'])
          }
        }
      })
    )

  }

}
