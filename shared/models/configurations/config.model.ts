import { varchar } from '../types'

export interface Config {
  id?: number
  data?: 'language' | varchar
  value?: string
}