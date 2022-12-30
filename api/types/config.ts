import { varchar } from "./types";

export interface Config {
  id?: number,
  data?: varchar,
  value?: any
}

export interface DBGeneration {
  config?: boolean,
  users?: boolean,
  logs?: boolean,
  bootstrap?: boolean,
  maintenance?: boolean,
  news?: boolean,
  news_categories?: boolean,
  news_tags?: boolean,
  backgrounds?: boolean,
  stats?: boolean,
  exp_jwt?: boolean
}

export interface TableColumns {
  name: string,
  info: string
}
