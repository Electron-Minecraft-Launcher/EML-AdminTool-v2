import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  /**
   * @param { string } selector Query selector of the element.
   * @param { number } after Start transition after ... ms after the last transition.
   * @param { number } duration The transition duration (in function of the CSS).
   * @param { string } newText The new text to show
   */
  async changeTexteWithTransition(selector: string, after: number, duration: number, newText: string): Promise<void> {

    let element: HTMLElement | null = document.querySelector(selector);

    if (!element) {
      return
    }
    await this.sleep(+after)
    element.style.opacity = '0';
    await this.sleep(+duration / 2);
    element.innerHTML = newText + '';
    element.style.opacity = '1';

  }

  /**
   * @param { string } selector Query selector of the element.
   * @param { number } after Start transition after ... ms after the last transition.
   * @param { number } duration The transition duration (in function of the CSS).
   */
   async displayElementWithTransition(selector: string, after: number, duration: number,): Promise<void> {
    let element: HTMLElement | null = document.querySelector(selector);

    if (!element) {
      return
    }
    await this.sleep(+after)
    element.style.display = 'block';
    await this.sleep(+duration)
    element.style.opacity = '1';
  }

  /**
   * @param { string } selector Query selector of the element.
   * @param { number } after Start transition after ... ms after the last transition.
   * @param { number } duration The transition duration (in function of the CSS).
   */
  async unDisplayElementWithTransition(selector: string, after: number, duration: number,): Promise<void> {
    let element: HTMLElement | null = document.querySelector(selector);

    if (!element) {
      return
    }
    await this.sleep(+after)
    element.style.opacity = '0';
    await this.sleep(+duration);
    element.style.display = 'none';
  }


  /**
   * @param duration The duration of sleeping (in ms)
   */
  sleep(duration: number) {
    return new Promise(resolve => setTimeout(resolve, duration));
  }

}
