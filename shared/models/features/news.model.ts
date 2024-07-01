export interface News {
  id?: number
  title: string
  content: string
  author: number
  date: Date
  edition_date?: Date | null
  categories?: number[] | string
  tags?: number[] | string
}

export interface NewsCategory {
  id?: number
  title: string
  date: string
}

export interface NewsCategoryRes extends NewsCategory {
  news: News[]
}

export interface NewsTag {
  id?: number
  title: string
  color: string
}