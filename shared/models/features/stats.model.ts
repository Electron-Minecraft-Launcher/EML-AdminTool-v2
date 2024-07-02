export interface StatsRes {
  startups: { date: Date }[]
  launchings: { date: Date; os: 'windows' | 'mac' | 'linux' }[]
  connections: { date: Date }[]
  devtools: { date: Date }[]
}

export interface Stats {
  id?: number
  action: 'startup' | 'launching' | 'connections' | 'devtools'
  date: Date
  info?: string
}
