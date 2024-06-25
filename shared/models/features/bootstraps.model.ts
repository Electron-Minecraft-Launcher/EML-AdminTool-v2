import { File } from "./file.model"

export interface Bootstraps {
  id?: number
  win?: string
  mac?: string
  lin?: string
  version?: string
}

export interface BootstrapsRes {
  win: File | null
  mac: File | null
  lin: File | null
  version: string
}
