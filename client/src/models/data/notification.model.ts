export interface Notification {
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
  content: string
}
