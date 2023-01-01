import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class DisplayUtilsService {

  constructor(private utils: UtilsService) { }

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
    await this.utils.sleep(+after)
    element.style.opacity = '0';
    await this.utils.sleep(+duration / 2);
    element.innerHTML = newText + '';
    element.style.opacity = '1';

  }

  /**
   * @param { string } selector Query selector of the element.
   * @param { number } after Start transition after ... ms after the last transition.
   * @param { number } duration The transition duration (in function of the CSS).
   */
  async displayElementWithTransition(selector: string, after: number, duration: number): Promise<void> {
    let element: HTMLElement | null = document.querySelector(selector);

    if (!element) {
      return
    }
    await this.utils.sleep(+after)
    element.style.display = 'block';
    await this.utils.sleep(+duration)
    element.style.opacity = '1';
  }

  /**
   * @param { string } selector Query selector of the element.
   * @param { number } after Start transition after ... ms after the last transition.
   * @param { number } duration The transition duration (in function of the CSS).
   */
  async unDisplayElementWithTransition(selector: string, after: number, duration: number): Promise<void> {
    let element: HTMLElement | null = document.querySelector(selector);

    if (!element) {
      return
    }
    await this.utils.sleep(+after)
    element.style.opacity = '0';
    await this.utils.sleep(+duration);
    element.style.display = 'none';
  }

  async showModal(modalId: string = 'modal'): Promise<void> {
    let modalBackground = document.querySelector<HTMLElement>('div.modal-background#' + modalId)
    let modal = document.querySelector<HTMLElement>('div.modal-background#' + modalId + ' div.modal')

    if (!modalBackground || !modal) {
      return
    }

    modalBackground.style.display = 'block';
    await this.utils.sleep(200)
    modal.style.transform = 'scale(100%)';
    modalBackground.style.opacity = '1';
  }

  async closeModal(modalId: string = 'modal'): Promise<void> {
    let modalBackground = document.querySelector<HTMLElement>('div.modal-background#' + modalId)
    let modal = document.querySelector<HTMLElement>('div.modal-background#' + modalId + ' div.modal')

    if (!modalBackground || !modal) {
      return
    }

    modalBackground.style.opacity = '0';
    modal.style.transform = 'scale(150%)';
    await this.utils.sleep(200)
    modalBackground.style.display = 'none';
  }

}
