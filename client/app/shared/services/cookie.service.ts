import { Injectable } from '@angular/core';
import { Cookie } from '../models/data/cookie.model';

@Injectable({
  providedIn: 'root'
})
export class CookiesService {

  constructor() { }

  getCookie(name: string): string {
    let ca: Array<string> = document.cookie.split(';');
    let caLen: number = ca.length;
    let cookieName = `${name}=`;
    let c: string;

    for (let i: number = 0; i < caLen; i += 1) {
      c = ca[i].replace(/^\s+/g, '');
      if (c.indexOf(cookieName) == 0) {
        return c.substring(cookieName.length, c.length);
      }
    }
    return '';
  }

  deleteCookie(name: string): void {
    this.setCookie({ name: name, value: '', expireDays: -1 });
  }

  setCookie(params: Cookie): void {
    let d: Date = new Date();
    d.setTime(
      d.getTime() +
      (params.expireDays ? params.expireDays : 90) * 24 * 60 * 60 * 1000
    );

    document.cookie =
      (
        params.name
          ? params.name
          : ''
      )
      + '=' +
      (
        params.value
          ? params.value
          : ''
      )
      + ';' +
      (
        params.session && params.session == true
          ? ''
          : 'expires=' + d.toUTCString() + ';'
      )
      + 'path=' +
      (
        params.path && params.path.length > 0
          ? params.path
          : '/'
      )
      + ';' +
      (
        location.protocol === 'https:' && params.secure && params.secure == true
          ? 'secure'
          : ''
      );
  }

}
