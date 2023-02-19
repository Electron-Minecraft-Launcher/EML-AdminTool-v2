import mysql, { RowDataPacket } from 'mysql2'
import dotenv from 'dotenv'
import { DBGeneration } from '../models/configurations/db-generation.model'
import { TableColumn } from '../models/configurations/tables-column.model'
import dbSchema from '../models/schemas/database.model';

dotenv.config()

// export const db = mysql.createConnection({
//   host: '127.0.0.1',
//   user: 'eml',
//   password: process.env['DATABASE_PASSWORD'],
//   database: 'eml_admintool'
// })

export function db() {
  var db = mysql.createConnection({
    host: 'localhost',
    user: 'eml',
    password: process.env['DATABASE_PASSWORD'],
    database: 'eml_admintool'
  })
  db.connect(function (err) {
    if (!err) {
      console.log("mysql connected")
    } else {
      console.log("mysql connection lost")
    }
  })
  return db
}


/**
 * Make a query to the Database. **Use this function in a try/catch and with async/await!**
 * @param query The SQL query
 * @param values The values of the query
 * @returns The data or an error
 */
export async function query<T>(query: string, values?: any | any[]): Promise<T & RowDataPacket[]> {

  if (values) {

    return new Promise((resolve, reject) => {
      db().query<T & RowDataPacket[]>(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      })
    })

  } else {

    return new Promise((resolve, reject) => {
      db().query<T & RowDataPacket[]>(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      })
    })

  }

}


/**
 * Get the tables to generate or regenerate
 * @returns An `DBGeneration` object where each `true` means that we need to generate or regenerate the table.
 */
export async function getTablesToGenerate(): Promise<DBGeneration> {

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
  const t = Object.entries(tables).filter(([, value]) => value === false).map(([key]) => key)

  for (let table of t) {

    var [isTable]: any = []
    try {
      [isTable] = await query('SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = \'eml_admintool\' AND table_name = ?', [table])
    } catch (error: any) {
      throw new Error(error.code)
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
export async function dbGenerate(tables: DBGeneration): Promise<void> {

  var [isDb]: any = []
  const t = Object.entries(tables).filter(([, value]) => value === false).map(([key]) => key)

  try {
    [isDb] = await query('SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = \'eml_admintool\'')
  } catch (error: any) {
    throw new Error(error.code)
  }

  if (isDb.count == 0) {
    try {
      query(`CREATE DATABASE eml_admintool`)
    } catch (error: any) {
      throw new Error(error.code)
    }
  }

  for (let table of t) {
    try {
      await recreateTable(table, dbSchema[table])
    } catch (error: any) {
      throw new Error(error.code)
    }
  }



}


async function recreateTable(table: string, columns: TableColumn[]) {

  var [isTable]: any = []

  try {
    [isTable] = await query('SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = \'eml_admintool\' AND table_name = ?', [table])
  } catch (error: any) {
    throw new Error(error.code)
  }

  if (isTable.count > 0) {
    try {
      await query('DROP TABLE ?', [table]);
    } catch (error: any) {
      throw new Error(error.code)
    }
  }

  var columns_: string | null = ''

  var i = 0
  columns.forEach(col => {
    if (i == 0) {
      columns_ += ` ${col.name} ${col.info}`
    } else {
      columns_ += `, ${col.name} ${col.info}`
    }
    i++
  })

  try {
    await query('CREATE TABLE ' + table + ' (' + columns_ + ')')
  } catch (error: any) {
    throw new Error(error.code)
  }

}
