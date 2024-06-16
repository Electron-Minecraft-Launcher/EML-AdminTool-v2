import { varchar } from '../types'

export interface Maintenance {
  id?: number
  start_date?: varchar
  end_date?: varchar
  reason?: varchar
}
