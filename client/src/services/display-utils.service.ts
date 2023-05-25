import utils from './utils'

export default class DisplayUtilsService {
  /**
   * @param selector Query selector of the element.
   * @param after Start transition after ... ms after the last transition.
   * @param duration The transition duration (in function of the CSS).
   * @param newText The new text to show
   */
  async changeTexteWithTransition(selector: string, after: number, duration: number, newText: string): Promise<void> {
    let element: HTMLElement | null = document.querySelector(selector)

    if (!element) {
      return
    }
    await utils.sleep(after)
    element.style.opacity = '0'
    await utils.sleep(duration / 2)
    element.innerHTML = newText + ''
    element.style.opacity = '1'
  }

  /**
   * @param selector Query selector of the element.
   * @param after Start transition after ... ms after the last transition.
   * @param duration The transition duration (in function of the CSS).
   */
  async displayElementWithTransition(selector: string, after: number, duration: number): Promise<void> {
    let element: HTMLElement | null = document.querySelector(selector)

    if (!element) {
      return
    }
    await utils.sleep(after)
    element.style.display = 'block'
    await utils.sleep(duration)
    element.style.opacity = '1'
  }

  /**
   * @param selector Query selector of the element.
   * @param after Start transition after ... ms after the last transition.
   * @param duration The transition duration (in function of the CSS).
   */
  async unDisplayElementWithTransition(selector: string, after: number, duration: number): Promise<void> {
    let element: HTMLElement | null = document.querySelector(selector)

    if (!element) {
      return
    }
    await utils.sleep(after)
    element.style.opacity = '0'
    await utils.sleep(duration)
    element.style.display = 'none'
  }

  /**
   * @param modalId The modal's ID.
   */
  async showModal(modalId: string = 'modal'): Promise<void> {
    let modalBackground = document.querySelector<HTMLElement>('div.modal-background#' + modalId)
    let modal = document.querySelector<HTMLElement>('div.modal-background#' + modalId + ' div.modal')

    if (!modalBackground || !modal) {
      return
    }

    modalBackground.style.display = 'block'
    await utils.sleep(200)
    modal.style.transform = 'scale(100%)'
    modalBackground.style.opacity = '1'
  }

  /**
   * @param modalId The modal's ID.
   */
  async closeModal(modalId: string = 'modal'): Promise<void> {
    let modalBackground = document.querySelector<HTMLElement>('div.modal-background#' + modalId)
    let modal = document.querySelector<HTMLElement>('div.modal-background#' + modalId + ' div.modal')

    if (!modalBackground || !modal) {
      return
    }

    modalBackground.style.opacity = '0'
    modal.style.transform = 'scale(150%)'
    await utils.sleep(200)
    modalBackground.style.display = 'none'
  }
}
