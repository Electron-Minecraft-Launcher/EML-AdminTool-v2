import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  /**
   * @param duration The duration of sleeping (in ms)
   */
  sleep(duration: number) {
    return new Promise(resolve => setTimeout(resolve, duration));
  }

}
