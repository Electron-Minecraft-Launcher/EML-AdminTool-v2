export interface Cookie {
  name: string
  value: string
  session?: boolean
  path?: string
  secure?: boolean
  expireDays?: number
}
