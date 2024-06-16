import { DBGeneration } from '../configurations/db-generation.model'
import { TableColumn } from '../configurations/tables-column.model'

const schema: DBGeneration & Record<string, TableColumn[]> = {
  config: [
    { name: 'id', info: 'INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT' },
    { name: 'data', info: 'VARCHAR(255)' },
    { name: 'value', info: 'TEXT' },
  ],

  users: [
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
    { name: 'p_stats_see', info: 'TINYINT' },
    { name: 'p_stats_del', info: 'TINYINT' },
  ],

  logs: [
    { name: 'id', info: 'INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT' },
    { name: 'date', info: 'VARCHAR(255)' },
    { name: 'place', info: 'VARCHAR(255)' },
    { name: 'type', info: 'VARCHAR(255)' },
    { name: 'data', info: 'TEXT' },
  ],

  bootstrap: [
    { name: 'id', info: 'INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT' },
    { name: 'win', info: 'VARCHAR(255)' },
    { name: 'mac', info: 'VARCHAR(255)' },
    { name: 'lin', info: 'VARCHAR(255)' },
    { name: 'version', info: 'VARCHAR(255)' },
  ],

  maintenance: [
    { name: 'id', info: 'INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT' },
    { name: 'start_date', info: 'VARCHAR(255)' },
    { name: 'end_date', info: 'VARCHAR(255)' },
    { name: 'reason', info: 'VARCHAR(255)' },
  ],

  news: [
    { name: 'id', info: 'INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT' },
    { name: 'title', info: 'VARCHAR(255)' },
    { name: 'content', info: 'TEXT' },
    { name: 'author', info: 'INT(11)' },
    { name: 'date', info: 'VARCHAR(255)' },
    { name: 'category', info: 'INT(11)' },
    { name: 'tags', info: 'INT(11)' },
  ],

  news_categories: [
    { name: 'id', info: 'INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT' },
    { name: 'title', info: 'VARCHAR(255)' },
    { name: 'date', info: 'VARCHAR(255)' },
  ],

  news_tags: [
    { name: 'id', info: 'INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT' },
    { name: 'title', info: 'VARCHAR(255)' },
  ],

  backgrounds: [
    { name: 'id', info: 'INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT' },
    { name: 'title', info: 'VARCHAR(255)' },
    { name: 'status', info: 'TINYINT' },
  ],

  stats: [
    { name: 'id', info: 'INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT' },
    { name: 'dates', info: 'VARCHAR(255)' },
    { name: 'startups', info: 'INT(11)' },
    { name: 'launching', info: 'INT(11)' },
    { name: 'new_players', info: 'INT(11)' },
  ],

  exp_jwt: [
    { name: 'id', info: 'INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT' },
    { name: 'jwt', info: 'TEXT' },
  ],
}

export default schema
