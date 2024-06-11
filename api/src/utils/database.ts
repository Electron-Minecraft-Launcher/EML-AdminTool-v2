import mysql, { RowDataPacket } from 'mysql2/promise'
import dotenv from 'dotenv'
import { DBGeneration } from '$models/configurations/db-generation.model'
import { TableColumn } from '$models/configurations/tables-column.model'
import { count } from '$models/types'
import dbSchema from '$models/schemas/database.model'

dotenv.config()

class DataBase {
  static db: mysql.Pool = mysql.createPool({
    host: 'localhost',
    user: 'eml',
    password: process.env['DATABASE_PASSWORD'],
    database: 'eml_admintool'
  })

  /**
   * Make a query to the Database. **Use this function in a try/catch and with async/await!**
   * @param query The SQL query
   * @param values The values of the query
   * @returns The data or an error
   */
  async query<T>(query: string, values?: any | any[]): Promise<T & RowDataPacket[]> {
    if (values) {
      try {
        return (await DataBase.db.query<T & RowDataPacket[]>(query, values))[0]
      } catch (error: any) {
        throw new Error(error)
      }
    } else {
      try {
        return (await DataBase.db.query<T & RowDataPacket[]>(query))[0]
      } catch (error: any) {
        throw new Error(error)
      }
    }
  }

  /**
   * Get the table to (re)generate. **Use this function in a try/catch and with async/await!**
   * @returns The tables to (re)generate
   */
  async getTablesToGenerate(): Promise<DBGeneration> {
    var tables: DBGeneration & Record<string, boolean> = {
      config: false,
      users: false,
      logs: false,
      bootstrap: false,
      maintenance: false,
      news: false,
      news_categories: false,
      news_tags: false,
      backgrounds: false,
      stats: false,
      exp_jwt: false,
    }
    const t = Object.entries(tables)
      .filter(([, value]) => value === false)
      .map(([key]) => key)

    for (let table of t) {
      var isTable: count
      try {
        isTable = (
          await this.query<count[]>(
            "SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = 'eml_admintool' AND table_name = ?",
            [table]
          )
        )[0]
      } catch (error: any) {
        throw error
      }

      if (isTable.count == 0) {
        tables[table] = true
      }
    }

    return tables
  }

  /**
   * Generate or regenerate the database and the tables.
   * @param tables The array with the tables to generate. Could use `getTablesToGenerate()`.
   */
  async dbGenerate(tables: DBGeneration): Promise<void> {
    var isDb: count
    const t = Object.entries(tables)
      .filter(([, value]) => value === true)
      .map(([key]) => key)

    try {
      isDb = (
        await this.query<count[]>("SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'eml_admintool'")
      )[0]
    } catch (error: any) {
      throw error
    }

    if (isDb.count == 0) {
      try {
        this.query(`CREATE DATABASE eml_admintool`)
      } catch (error: any) {
        throw error
      }
    }

    for (let table of t) {
      try {
        await this.recreateTable(table, dbSchema[table])
      } catch (error: any) {
        throw error
      }
    }
  }

  async recreateTable(table: string, columns: TableColumn[]) {
    var isTable: count

    try {
      isTable = (
        await this.query<count[]>(
          "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'eml_admintool' AND table_name = ?",
          [table]
        )
      )[0]
    } catch (error: any) {
      throw error
    }

    if (isTable.count > 0) {
      try {
        console.log('DROP TABLE ' + table)
        await this.query('DROP TABLE ?', [table])
      } catch (error: any) {
        throw error
      }
    }

    var columns_: string | null = ''

    var i = 0
    columns.forEach((col) => {
      if (i == 0) {
        columns_ += ` ${col.name} ${col.info}`
      } else {
        columns_ += `, ${col.name} ${col.info}`
      }
      i++
    })

    try {
      await this.query('CREATE TABLE ' + table + ' (' + columns_ + ')')
    } catch (error: any) {
      throw error
    }
  }
}

export default new DataBase()
