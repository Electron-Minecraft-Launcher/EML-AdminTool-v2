import mysql, { RowDataPacket } from 'mysql2'
import dotenv from 'dotenv'
import { DBGeneration } from '../models/configurations/db-generation.model'
import { TableColumn } from '../models/configurations/tables-column.model'
import { Config } from '../models/configurations/config.model';

dotenv.config()

export const db = mysql.createConnection({
  host: '127.0.0.1',
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
export async function query<T>(query: string, values?: any | any[]): Promise<T & RowDataPacket[]> {

  if (values) {

    return new Promise((resolve, reject) => {
      db.query<T & RowDataPacket[]>(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      })
    })

  } else {

    return new Promise((resolve, reject) => {
      db.query<T & RowDataPacket[]>(query, (error, results) => {
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
 * Generate or regenerate the database and the tables.
 * @param tables The array with the tables to generate. Could use `getTablesToGenerate()`.
 */
export async function dbGenerate(tables: DBGeneration): Promise<void> {

  var [isDb]: any = []

  try {
    [isDb] = await query('SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = \'eml_admintool\'')
  } catch (error: any) {
    throw new Error(error.code)
  }

  if (isDb.count == 0) {
    db.promise().query(`CREATE DATABASE eml_admintool`)
  }

  if (tables.config) {
    await recreateTable(
      'config',
      [
        { name: 'id', info: 'INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT' },
        { name: 'data', info: 'VARCHAR(255)' },
        { name: 'value', info: 'TEXT' }
      ]
    )
  }

  if (tables.users) {
    await recreateTable(
      'users',
      [
        { name: 'id', info: 'INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT' },
        { name: 'name', info: 'VARCHAR(255)' },
        { name: 'password', info: 'VARCHAR(255)' },
        { name: 'status', info: 'TINYINT' },
        { name: 'admin', info: 'TINYINT' },
        { name: 'p_files_updater_add_del', info: 'TINYINT' },
        { name: 'p_bootstrap_mod', info: 'TINYINT' },
        { name: 'p_maintenance_mod', info: 'TINYINT' },
        { name: 'p_news_add', info: 'TINYINT' },
        { name: 'p_news_mod_del', info: 'TINYINT' },
        { name: 'p_news_category_add_mod_del', info: 'TINYINT' },
        { name: 'p_news_tag_add_mod_del', info: 'TINYINT' },
        { name: 'p_background_mod', info: 'TINYINT' },
        { name: 'p_stats_del', info: 'TINYINT' },
      ]
    )
  }

  if (tables.logs) {
    await recreateTable(
      'logs',
      [
        { name: 'id', info: 'INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT' },
        { name: 'date', info: 'VARCHAR(255)' },
        { name: 'place', info: 'VARCHAR(255)' },
        { name: 'type', info: 'VARCHAR(255)' },
        { name: 'data', info: 'TEXT' }
      ]
    )
  }

  if (tables.bootstrap) {
    await recreateTable(
      'bootstrap',
      [
        { name: 'id', info: 'INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT' },
        { name: 'win', info: 'VARCHAR(255)' },
        { name: 'mac', info: 'VARCHAR(255)' },
        { name: 'lin', info: 'VARCHAR(255)' },
        { name: 'version', info: 'VARCHAR(255)' }
      ]
    )
  }

  if (tables.maintenance) {
    await recreateTable(
      'maintenance',
      [
        { name: 'id', info: 'INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT' },
        { name: 'start_date', info: 'VARCHAR(255)' },
        { name: 'end_date', info: 'VARCHAR(255)' },
        { name: 'reason', info: 'VARCHAR(255)' }
      ]
    )
  }

  if (tables.news) {
    await recreateTable(
      'news',
      [
        { name: 'id', info: 'INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT' },
        { name: 'title', info: 'VARCHAR(255)' },
        { name: 'content', info: 'TEXT' },
        { name: 'author', info: 'INT(11)' },
        { name: 'date', info: 'VARCHAR(255)' },
        { name: 'category', info: 'INT(11)' },
        { name: 'tags', info: 'INT(11)' }
      ]
    )
  }

  if (tables.news_categories) {
    await recreateTable(
      'news_categories',
      [
        { name: 'id', info: 'INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT' },
        { name: 'title', info: 'VARCHAR(255)' },
        { name: 'date', info: 'VARCHAR(255)' }
      ]
    )
  }

  if (tables.news_tags) {
    await recreateTable(
      'news_tags',
      [
        { name: 'id', info: 'INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT' },
        { name: 'title', info: 'VARCHAR(255)' }
      ]
    )
  }

  if (tables.backgrounds) {
    await recreateTable(
      'backgrounds',
      [
        { name: 'id', info: 'INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT' },
        { name: 'title', info: 'VARCHAR(255)' },
        { name: 'status', info: 'TINYINT' }
      ]
    )
  }

  if (tables.stats) {
    await recreateTable(
      'stats',
      [
        { name: 'id', info: 'INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT' },
        { name: 'dates', info: 'VARCHAR(255)' },
        { name: 'startups', info: 'INT(11)' },
        { name: 'launching', info: 'INT(11)' },
        { name: 'new_players', info: 'INT(11)' }
      ]
    )
  }

  if (tables.exp_jwt) {
    await recreateTable(
      'exp_jwt',
      [
        { name: 'id', info: 'INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT' },
        { name: 'jwt', info: 'TEXT' }
      ]
    )
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

  var i = 0;
  columns.forEach(col => {
    if (i == 0) {
      columns_ += ' ' + col.name + ' ' + col.info + ''
    } else {
      columns_ += ', ' + col.name + ' ' + col.info + ''
    }
    i++
  })

  try {
    await query('CREATE TABLE ' + table + ' (' + columns_ + ')')
  } catch (error: any) {
    throw new Error(error.code)
  }

}

/**
 * Get the tables to generate or regenerate
 * @returns An `DBGeneration` object where each `true` means that we need to generate or regenerate the table.
 */
export async function getTablesToGenerate(): Promise<DBGeneration> {

  var tables: DBGeneration = {
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
      switch (table) {
        case 'config':
          tables.config = true
          break;
        case 'users':
          tables.users = true
          break;
        case 'logs':
          tables.logs = true
          break;
        case 'bootstrap':
          tables.bootstrap = true
          break;
        case 'maintenance':
          tables.maintenance = true
          break;
        case 'news':
          tables.news = true
          break;
        case 'news_categories':
          tables.news_categories = true
          break;
        case 'news_tags':
          tables.news_tags = true
          break;
        case 'backgrounds':
          tables.backgrounds = true
          break;
        case 'stats':
          tables.stats = true
          break;
        case 'exp_jwt':
          tables.exp_jwt = true
          break;
        default:
          break;
      }
    }
  }

  return tables

}
