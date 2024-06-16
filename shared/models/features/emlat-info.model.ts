import { User } from "./user.model"

export interface EMLAdminToolInfo {
  emlat: {
    language: string
    name: string
    theme: string
    pin: string
    nbUsers: number
  }
  vps: {
    os: string
    storage: number[]
  },
  users: User[]
}
