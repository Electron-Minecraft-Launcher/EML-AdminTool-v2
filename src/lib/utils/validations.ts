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

export const editUserSchema = z.object({
  userId: z.string(),
  username: z
    .string()
    .min(2, NotificationCode.EDIT_USER_USERNAME_TOO_SHORT)
    .max(64, NotificationCode.EDIT_USER_USERNAME_TOO_LONG)
    .transform((val) => val.trim()),
  p_filesUpdater_1: z.boolean(),
  p_filesUpdater_2: z.boolean(),
  p_bootstraps: z.boolean(),
  p_maintenance: z.boolean(),
  p_news_1: z.boolean(),
  p_news_2: z.boolean(),
  p_newsCategories: z.boolean(),
  p_newsTags: z.boolean(),
  p_backgrounds: z.boolean(),
  p_stats_1: z.boolean(),
  p_stats_2: z.boolean()
})

export const editAccountSchema = z
  .object({
    username: z
      .string()
      .min(2, NotificationCode.EDIT_ACCOUNT_USERNAME_TOO_SHORT)
      .max(64, NotificationCode.EDIT_ACCOUNT_USERNAME_TOO_LONG)
      .transform((val) => val.trim()),
    password: z.string().optional()
  })
  .refine((schema) => !(schema.password && schema.password != '' && schema.password.length < 8), {
    error: NotificationCode.EDIT_ACCOUNT_PASSWORD_TOO_SHORT,
    path: ['password']
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
