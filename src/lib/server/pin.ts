import { ServerError } from '$lib/utils/errors'
import { NotificationCode } from '$lib/utils/notifications'
import { db } from './db'

export async function checkPin(pin: string) {
  let dbPin
  try {
    dbPin = (await db.environment.findFirst({ select: { pin: true } }))!.pin
  } catch (err) {
    console.error('Error fetching PIN from database:', err)
    throw new ServerError('Failed to fetch PIN from database', err, NotificationCode.DATABASE_ERROR, 500)
  }

  return dbPin === pin
}
