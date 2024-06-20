import { Code } from '../../types'

export interface DefaultServiceResponse {
  status: boolean
  code: Code
  message?: string
}
