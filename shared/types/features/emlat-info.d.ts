import { User } from "./user"

export interface EMLAdminToolInfo {
  emlat: EMLAT
  vps: VPS,
  users: User[]
}

export interface EMLAT {
  language: string
  name: string
  theme: string
  pin: string
  nbUsers: number
}

export interface VPS {
  os: string
  storage: number[]
}
