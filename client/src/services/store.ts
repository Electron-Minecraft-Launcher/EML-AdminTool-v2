import type { Env } from './env.model'
import type { Notification } from '../../../shared/types/data/notification'
import type { User } from '../../../shared/types/features/user'
import { writable } from 'svelte/store'
import en from '../assets/language/en'
import type fr from '../assets/language/fr'
import type da from '../assets/language/da'

export let notification$ = writable<Notification | null>(null)

export const test = writable<string>('Bonjour')

export const env = writable<Env>({ language: en, name: 'EML', theme: 'default', version: ''})
export const user = writable<User>()
export const l = writable<typeof en | typeof fr | typeof da>(en)
