import dotenv from 'dotenv'
import mysql, { RowDataPacket } from 'mysql2/promise'
import { count } from '../../../shared/types/types'
import dbSchema from './schema'
import { DBGeneration } from '../../../shared/types/configurations/db-generation'
import { TableColumn } from '../../../shared/types/configurations/tables-column'
import filesService from '../services/files.service'
import path from 'path'

dotenv.config({ path: path.join(filesService.cwd(), 'api', 'env', '.env') })

class Database {
  static db: mysql.Pool = mysql.createPool({
    user: 'eml',
    host: 'db', // @git-ignore
    password: process.env['DATABASE_PASSWORD'] || 'eml',
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
        return (await Database.db.query<T & RowDataPacket[]>(query, values))[0]
      } catch (error: any) {
        console.log(error)
        throw new Error(error)
      }
    } else {
      try {
        return (await Database.db.query<T & RowDataPacket[]>(query))[0]
      } catch (error: any) {
        console.log(error)
        throw new Error(error)
      }
    }
  }

  /**
   * Escape a string to prevent HTML injection.
   * @param value The string to escape
   * @returns The escaped string
   */
  escapeHtml(value: string): string {
    return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
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
      loader: false,
      bootstraps: false,
      maintenance: false,
      news: false,
      news_categories: false,
      news_tags: false,
      backgrounds: false,
      stats: false,
      exp_jwt: false
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
   * Generate or regenerate the tables.
   * @param tables The array with the tables to generate. Use `getTablesToGenerate()`.
   */
  async generate(tables: DBGeneration): Promise<void> {
    try {
      await this.query('CREATE DATABASE IF NOT EXISTS eml_admintool')
    } catch (error) {
      throw error
    }

    Database.db.end()

    Database.db = mysql.createPool({
      user: 'eml',
      host: 'db', // @git-ignore
      password: process.env['DATABASE_PASSWORD'] || 'eml',
      database: 'eml_admintool'
    })

    const t = Object.entries(tables)
      .filter(([, value]) => value === true)
      .map(([key]) => key)

    for (let table of t) {
      try {
        await this.recreateTable(table, dbSchema[table])
      } catch (error: any) {
        throw error
      }
    }
  }

  private async recreateTable(table: string, columns: TableColumn[]) {
    var isTable: count

    try {
      isTable = (
        await this.query<count[]>("SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'eml_admintool' AND table_name = ?", [
          table
        ])
      )[0]
    } catch (error: any) {
      throw error
    }

    if (isTable.count > 0) {
      try {
        await this.query('DROP TABLE ?', [table])
      } catch (error: any) {
        throw error
      }
    }

    var columns_: string | null = ''

    var i = 0
    columns.forEach((col) => {
      columns_ += i === 0 ? ` ${col.name} ${col.info}` : `, ${col.name} ${col.info}`
      i++
    })

    try {
      await this.query('CREATE TABLE ' + table + ' (' + columns_ + ')')
    } catch (error: any) {
      throw error
    }
  }
}

export default new Database()

