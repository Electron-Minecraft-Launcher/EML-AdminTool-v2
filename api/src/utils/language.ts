import { Config } from '$models/configurations/config.model'
import db from '$utils/database'

class Language {
  async get(): Promise<string> {
    try {
      return (await db.query<Config[]>("SELECT * FROM config WHERE data = 'language'"))[0].value + ''
    } catch (error: any) {
      throw new Error(error)
    }
  }

  async set(language: 'en' | 'fr') {
    var data: Config[] = []

    try {
      data = await db.query<Config[]>("SELECT * FROM config WHERE data = 'language'")
    } catch (error: any) {
      throw Error(error)
    }

    if (data.find((language) => language.data == 'language')) {
      try {
        await db.query("UPDATE config SET value = ? WHERE data = 'language'", [language])
      } catch (error: any) {
        throw Error(error)
      }
    } else {
      try {
        await db.query("INSERT INTO config(data, value) VALUES ('language', ?)", [language])
      } catch (error: any) {
        throw Error(error)
      }
    }
  }
}

export default new Language()
