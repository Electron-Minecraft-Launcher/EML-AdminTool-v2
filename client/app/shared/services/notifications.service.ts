import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private notification: BehaviorSubject<any> = new BehaviorSubject(null)

  constructor() { }

  get(): Observable<any> {
    return this.notification.asObservable()
  }

  set(notification: { type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR', code: string }) {
    this.notification.next(notification)
  }

}
