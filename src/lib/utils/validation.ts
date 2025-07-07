import { z } from 'zod/v4'
import { NotificationCode } from './notifications'

export const setupSchema = z.object({
  language: z.string().length(2, NotificationCode.SETUP_INVALID_LANGUAGE),
  dbPassword: z.string().min(10, NotificationCode.SETUP_DATABASE_PASSWORD_TOO_SHORT),
  adminUsername: z
    .string()
    .min(2, NotificationCode.SETUP_ADMIN_USERNAME_TOO_SHORT)
    .transform((val) => val.trim()),
  adminPassword: z.string().min(8, NotificationCode.SETUP_ADMIN_PASSWORD_TOO_SHORT)
})

export const loginSchema = z.object({
  username: z
    .string()
    .min(2, NotificationCode.LOGIN_USERNAME_TOO_SHORT)
    .max(64, NotificationCode.LOGIN_USERNAME_TOO_LONG)
    .transform((val) => val.trim()),
  password: z.string()
})
