import { notification$ } from './store'
import utils from './utils'

export default class NotificationsService {
  private async set(n: { type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'; content: string }) {
    notification$.set(null)
    await utils.sleep(10)
    notification$.set(n)
  }

  async update(notification: { type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'; code: string }) {
    switch (notification.code) {
      case 'login':
        this.set({ type: 'ERROR', content: 'Please log in again.' })
        break
      case 'auth':
        this.set({ type: 'ERROR', content: 'Wrong username or password.' })
        break
      case 'permission':
        this.set({ type: 'ERROR', content: 'You are not allowed to join this page.' })
      case 'db':
        this.set({ type: 'ERROR', content: 'An unknown Database error happened' })
      default:
        this.set({ type: 'ERROR', content: 'An unknown error happened' })
        break
    }
  }
}
