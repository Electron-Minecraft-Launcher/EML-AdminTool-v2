import type { LanguageCode } from '$lib/stores/language'
import { ServerError } from '$lib/utils/errors'
import { NotificationCode } from '$lib/utils/notifications'
import { db } from './db'

export async function editEMLAT(name: string, language: LanguageCode, pin: string) {
  try {
    await db.environment.update({
      where: { id: '1' },
      data: { name, language, pin }
    })
  } catch (err) {
    console.error('Error updating EMLAT:', err)
    throw new ServerError('Failed to update EMLAT', err, NotificationCode.DATABASE_ERROR, 500)
  }

  try {
    await db.user.update({
      where: { isAdmin: true, id: '1' },
      data: { username: name }
    })
  } catch (err) {
    console.error('Error updating admin user:', err)
    throw new ServerError('Failed to update admin user', err, NotificationCode.DATABASE_ERROR, 500)
  }
}
