export interface News {
  id?: number
  title: string
  content: string
  author: number
  date: string
  category?: number
  tags?: number
}

export interface NewsCategory {
  id?: number
  title?: string
  date?: string
}

export interface NewsTag {
  id?: number
  title?: string
}
