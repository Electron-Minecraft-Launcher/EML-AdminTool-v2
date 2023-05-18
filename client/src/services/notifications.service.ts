import { notification } from './store'
import utils from './utils'

export class NotificationsService {
  private async set(n: { type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'; content: string }) {
    notification.set(null)
    await utils.sleep(10)
    notification.set(n)
  }

  async update(notification: { type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'; code: string }) {
    if (notification.code == 'login') {
      this.set({ type: 'ERROR', content: 'Please log in again.' })
    } else if (notification.code == 'auth') {
      this.set({ type: 'ERROR', content: 'Wrong username or password.' })
    } else if (notification.code == 'permission') {
      this.set({ type: 'ERROR', content: 'You are not allowed to join this page.' })
    }
  }
}
