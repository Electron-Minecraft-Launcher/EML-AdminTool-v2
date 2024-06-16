import { Config } from '../../../shared/models/configurations/config.model'
import db from '../utils/db'

class LanguageService {
  async get(): Promise<string> {
    this.check()

    try {
      return (await db.query<Config[]>("SELECT * FROM config WHERE data = 'language'"))[0].value + ''
    } catch (error: any) {
      throw new Error(error)
    }
  }

  /**
   * Check if language is in DB. If not, add it.
   * @param language `'en'` or `'fr'` to force setting the language (if not given, the function will juste check if the language is in DB)
   */
  async check(language?: 'en' | 'fr') {
    var data: Config[] = []

    try {
      data = await db.query<Config[]>("SELECT * FROM config WHERE data = 'language'")
    } catch (error: any) {
      throw error
    }

    if (data.find((language) => language.data == 'language')) {
      if (language === 'en' || language === 'fr') {
        try {
          await db.query("UPDATE config SET value = ? WHERE data = 'language'", [language])
        } catch (error: any) {
          throw error
        }
      }
    } else {
      try {
        await db.query("INSERT INTO config(data, value) VALUES ('language', ?)", [language || 'en'])
      } catch (error: any) {
        throw error
      }
    }
  }
}

export default new LanguageService()
