import { varchar } from "./types"

export interface News {
  id?: number,
  title?: varchar,
  content?: string,
  author?: number,
  date?: varchar,
  category?: number,
  tags?: number
}

export interface NewsCategory {
  id?: number,
  title?: varchar,
  date?: varchar
}

export interface NewsTag {
  id?: number,
  title?: varchar
}
