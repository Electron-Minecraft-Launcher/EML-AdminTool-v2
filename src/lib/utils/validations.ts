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

export const editEMLATSchema = z.object({
  name: z.string().min(2, NotificationCode.EMLAT_NAME_TOO_SHORT).max(64, NotificationCode.EMLAT_NAME_TOO_LONG),
  language: z.string().length(2, NotificationCode.EMLAT_INVALID_LANGUAGE),
  regeneratePin: z.boolean()
})

export const loginSchema = z.object({
  username: z
    .string()
    .min(2, NotificationCode.LOGIN_USERNAME_TOO_SHORT)
    .max(64, NotificationCode.LOGIN_USERNAME_TOO_LONG)
    .transform((val) => val.trim()),
  password: z.string()
})

export const registerSchema = z.object({
  username: z
    .string()
    .min(2, NotificationCode.REGISTER_USERNAME_TOO_SHORT)
    .max(64, NotificationCode.REGISTER_USERNAME_TOO_LONG)
    .transform((val) => val.trim()),
  password: z.string().min(8, NotificationCode.REGISTER_PASSWORD_TOO_SHORT),
  pin: z.string().length(3, NotificationCode.REGISTER_PIN_INVALID)
})
