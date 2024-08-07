import { Config } from "../../../shared/types/configurations/config"
import { count } from "../../../shared/types/types"
import db from "../utils/db"

class PINService {
  async get(): Promise<string> {
    try {
      return (await db.query<Config[]>("SELECT * FROM config WHERE data = 'pin'"))[0].value + ''
    } catch (error: any) {
      throw new Error(error)
    }
  }

  /**
   * Check if PIN is in DB. If not, generate a new one and save it in DB.
   * @param regenerate Force regeneration of PIN
   * @returns Nothing or the new PIN
   */
  async check(regenerate: boolean = false): Promise<void | string> {
    var isPinInDB: count

    try {
      isPinInDB = (await db.query<count[]>("SELECT COUNT(*) AS count FROM config WHERE data = 'pin'"))[0]
    } catch (error: any) {
      throw error
    }

    if (isPinInDB.count > 1 || isPinInDB.count == 0 || regenerate) {
      const pin = Math.floor(Math.random() * 10) + '' + Math.floor(Math.random() * 10) + '' + Math.floor(Math.random() * 10)

      try {
        await db.query("DELETE FROM config WHERE data = 'pin'")
      } catch (error: any) {
        throw error
      }

      try {
        await db.query("INSERT INTO config (data, value) VALUES ('pin', ?)", pin)
      } catch (error: any) {
        throw error
      }

      return pin
    }
  }
}

export default new PINService()
