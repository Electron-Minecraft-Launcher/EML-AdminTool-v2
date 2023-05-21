import { redirect$ } from './store'
import utils from './utils'

class Router {
  async goto(path: string) {
    redirect$.set(null)
    await utils.sleep(10)
    redirect$.set(path)   
  }
}

export default new Router()