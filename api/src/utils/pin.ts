import { Config } from '$models/configurations/config.model'
import { count } from '$models/types'
import db from './database'

class PIN {
  async get(): Promise<string> {
    try {
      return (await db.query<Config[]>("SELECT * FROM config WHERE data = 'pin'"))[0].value + ''
    } catch (error: any) {
      throw new Error(error)
    }
  }

  generate(): string {
    return Math.floor(Math.random() * 10) + '' + Math.floor(Math.random() * 10) + '' + Math.floor(Math.random() * 10)
  }

  async check(regenerate: boolean = false): Promise<void | string> {
    var isPinInDB: count

    try {
      isPinInDB = (await db.query<count[]>("SELECT COUNT(*) AS count FROM config WHERE data = 'pin'"))[0]
    } catch (error: any) {
      throw new Error(error)
    }

    if (isPinInDB.count > 1 || isPinInDB.count == 0 || regenerate) {
      const pin = this.generate()

      try {
        await db.query("DELETE FROM config WHERE data = 'pin'")
      } catch (error: any) {
        throw new Error(error)
      }

      try {
        await db.query("INSERT INTO config (data, value) VALUES ('pin', ?)", pin)
      } catch (error: any) {
        throw new Error(error)
      }

      return pin
    }
  }
}

export default new PIN()
