import { DBGeneration } from '../../../shared/types/configurations/db-generation'
import { TableColumn } from '../../../shared/types/configurations/tables-column'

const schema: DBGeneration & Record<string, TableColumn[]> = {
  config: [
    { name: 'id', info: 'INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT' },
    { name: 'data', info: 'VARCHAR(255)' },
    { name: 'value', info: 'TEXT' }
  ],

  users: [
    { name: 'id', info: 'INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT' },
    { name: 'name', info: 'VARCHAR(255)' },
    { name: 'password', info: 'VARCHAR(255)' },
    { name: 'status', info: 'TINYINT' },
    { name: 'admin', info: 'TINYINT' },
    { name: 'p_files_updater_add_del', info: 'TINYINT' },
    { name: 'p_files_updater_loader_mod', info: 'TINYINT' },
    { name: 'p_bootstraps_mod', info: 'TINYINT' },
    { name: 'p_maintenance_mod', info: 'TINYINT' },
    { name: 'p_news_add', info: 'TINYINT' },
    { name: 'p_news_mod_del', info: 'TINYINT' },
    { name: 'p_news_categories_add_mod_del', info: 'TINYINT' },
    { name: 'p_news_tags_add_mod_del', info: 'TINYINT' },
    { name: 'p_background_mod', info: 'TINYINT' },
    { name: 'p_stats_see', info: 'TINYINT' },
    { name: 'p_stats_del', info: 'TINYINT' }
  ],

  logs: [
    { name: 'id', info: 'INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT' },
    { name: 'date', info: 'VARCHAR(255)' },
    { name: 'user', info: 'INT(11)' },
    { name: 'type', info: 'VARCHAR(255)' },
    { name: 'data', info: 'TEXT' }
  ],

  loader: [
    { name: 'id', info: 'INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT' },
    { name: 'loader', info: 'VARCHAR(255)' },
    { name: 'minecraft_version', info: 'VARCHAR(255)' },
    { name: 'loader_version', info: 'VARCHAR(255) NULL' },
    { name: 'loader_type', info: 'VARCHAR(255) NULL' },
    { name: 'file', info: 'TEXT' }
  ],

  bootstraps: [
    { name: 'id', info: 'INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT' },
    { name: 'win', info: 'VARCHAR(255)' },
    { name: 'mac', info: 'VARCHAR(255)' },
    { name: 'lin', info: 'VARCHAR(255)' },
    { name: 'version', info: 'VARCHAR(255)' }
  ],

  maintenance: [
    { name: 'id', info: 'INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT' },
    { name: 'start_date', info: 'DATETIME' },
    { name: 'end_date', info: 'DATETIME' },
    { name: 'reason', info: 'VARCHAR(255)' }
  ],

  news: [
    { name: 'id', info: 'INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT' },
    { name: 'title', info: 'VARCHAR(255)' },
    { name: 'content', info: 'TEXT' },
    { name: 'author', info: 'INT(11)' },
    { name: 'date', info: 'DATETIME' },
    { name: 'edition_date', info: 'DATETIME' },
    { name: 'categories', info: 'VARCHAR(255)' },
    { name: 'tags', info: 'VARCHAR(255)' }
  ],

  news_categories: [
    { name: 'id', info: 'INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT' },
    { name: 'title', info: 'VARCHAR(255)' },
    { name: 'date', info: 'VARCHAR(255)' }
  ],

  news_tags: [
    { name: 'id', info: 'INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT' },
    { name: 'title', info: 'VARCHAR(255)' },
    { name: 'color', info: 'VARCHAR(255)' }
  ],

  backgrounds: [
    { name: 'id', info: 'INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT' },
    { name: 'title', info: 'VARCHAR(255)' },
    { name: 'status', info: 'TINYINT' },
    { name: 'path', info: 'VARCHAR(255)' }
  ],

  stats: [
    { name: 'id', info: 'INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT' },
    { name: 'action', info: 'VARCHAR(255)' },
    { name: 'date', info: 'DATETIME' },
    { name: 'info', info: 'VARCHAR(255)' }
  ],

  exp_jwt: [
    { name: 'id', info: 'INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT' },
    { name: 'jwt', info: 'TEXT' }
  ]
}

export default schema
