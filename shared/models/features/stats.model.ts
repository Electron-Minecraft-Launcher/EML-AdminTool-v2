export interface StatsRes {
  startups: { date: Date }[]
  launches: { date: Date; os: 'windows' | 'mac' | 'linux' }[]
  connections: { date: Date }[]
  devtools: { date: Date }[]
}

export interface Stats {
  id?: number
  action: 'startups' | 'launches' | 'connections' | 'devtools'
  date: Date
  info?: string
}
