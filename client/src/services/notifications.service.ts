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
      case 'tmr':
        this.set({ type: 'ERROR', content: 'Too many requests. Please refresh the page in few minutes.' })
        break
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
      case 'updating_up-to-date':
        this.set({ type: 'SUCCESS', content: 'You are already up to date.' })
        break
      // case 'updating_fetching':
      //   this.set({ type: 'ERROR', content: 'Unable to fetch the update. Please see the logs.' })
      //   break
      // case 'updating_downloading':
      //   this.set({ type: 'ERROR', content: 'Unable to download the update. Please see the logs.' })
      //   break
      // case 'updating_script':
      //   this.set({ type: 'ERROR', content: 'Unable to run the update script. Please see the logs.' })
      //   break
      // case 'updating_docker_load':
      //   this.set({ type: 'ERROR', content: 'Unable to install the update. Please see the logs.' })
      //   break
      // case 'updating_docker_run':
      //   this.set({ type: 'ERROR', content: 'Unable to install the update. Please see the logs.' })
      //   break
      default:
        if (notification.code.startsWith('updating_')) {
          this.set({ type: 'ERROR', content: 'Unable to update. Please see the logs.' })
          return
        }
        this.set({ type: 'ERROR', content: 'An unknown error happened.' })
        break
    }
  }
}

export default new NotificationsService()



