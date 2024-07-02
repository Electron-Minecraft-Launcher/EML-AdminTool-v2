import { File } from './file.model'

export interface Background {
  id?: number
  title?: string
  status: number | boolean
  path?: string
}

export interface BackgroundsRes extends File, Partial<Background> {
  path: string
}
