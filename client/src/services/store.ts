import type { Env } from './env.model'
import type { Notification } from '../../../shared/models/data/notification.model'
import type { User } from '../../../shared/models/features/user.model'
import { writable } from 'svelte/store'
import en from '../assets/language/en'
import type fr from '../assets/language/fr'

export let notification$ = writable<Notification | null>(null)
export let redirect$ = writable<string | null>(null)
// export let env$ = writable<Env>()
// export let user$ = writable<User>()

export const test = writable<string>('Bonjour')

export const env = writable<Env>({ language: en, name: 'EML', theme: 'default' })
export const user = writable<User>()
export const l = writable<typeof en | typeof fr>(en)

// env$.subscribe((value) => {
//   if (value && value.language && typeof value.language !== 'string') {
//     env = value
//     l = value.language
//   }
// })

// user$.subscribe((value) => {
//   if (value) user = value
//   console.log(value)
// })
