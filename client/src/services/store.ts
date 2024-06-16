import type { Env } from '../../../shared/models/data/env.model'
import type { Notification } from '../../../shared/models/data/notification.model'
import type { User } from '../../../shared/models/features/user.model'
import { writable } from 'svelte/store'

export let notification$ = writable<Notification | null>(null)
export let redirect$ = writable<string | null>(null)
export let env$ = writable<Env>()
export let user$ = writable<User>()