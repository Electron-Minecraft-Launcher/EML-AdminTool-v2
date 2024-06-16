import { goto } from '$app/navigation'
import { redirect$ } from './store'
import utils from './utils'
import { redirect as r_ } from '@sveltejs/kit'

class Router {
  async goto(path: string) {
    redirect$.set(null)
    await utils.sleep(10)
    redirect$.set(path)   
  }
}

/**
 * @debug
 */
// export function redirect(code: 300, path: string, from = 'unknown') {
//   console.log(path, from);
//   goto(path)
// }

export default new Router()