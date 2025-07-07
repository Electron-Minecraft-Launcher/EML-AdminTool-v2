import { BusinessError, ServerError } from '$lib/utils/errors'
import { NotificationCode } from '$lib/utils/notifications'
import { UserStatus } from '@prisma/client'
import { db } from './db'
import bcrypt from 'bcrypt'
import { createSessionToken } from './jwt'

export async function login(username: string, password: string) {
  let user
  try {
    user = await db.user.findUnique({ where: { username } })
  } catch (err) {
    console.error('Error fetching user:', err)
    throw new ServerError('Failed to fetch user', err, NotificationCode.DATABASE_ERROR, 500)
  }

  if (!user || user.status == UserStatus.DELETED) {
    throw new BusinessError('User not found', NotificationCode.LOGIN_BAD_CREDENTIALS, 401)
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    throw new BusinessError('Invalid password', NotificationCode.LOGIN_BAD_CREDENTIALS, 401)
  }

  const sessionToken = await createSessionToken(user)

  return {sessionToken, user}
}
