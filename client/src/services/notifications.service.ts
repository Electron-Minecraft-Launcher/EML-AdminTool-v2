import { notification$ } from './store'
import utils from './utils'

class NotificationsService {
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
      case 'username':
        this.set({ type: 'ERROR', content: 'This username is already used.' })
        break
      case 'permission':
        this.set({ type: 'ERROR', content: 'You are not allowed to join this page.' })
        break
      case 'db':
        this.set({ type: 'ERROR', content: 'An unknown Database error happened' })
        break
      case 'download':
        this.set({ type: 'ERROR', content: 'Unable to download the file. It may have been deleted.' })
        break
      case 'upload':
        this.set({ type: 'ERROR', content: 'Unable to upload the files.' })
        break
      case 'rename':
        this.set({ type: 'ERROR', content: 'Unable to rename the file. It may have been deleted.' })
        break
      default:
        this.set({ type: 'ERROR', content: 'An unknown error happened' })
        break
    }
  }
}

export default new NotificationsService()
