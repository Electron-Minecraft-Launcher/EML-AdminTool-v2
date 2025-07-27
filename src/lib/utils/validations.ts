import { z } from 'zod/v4'
import { NotificationCode } from './notifications'
import { LoaderType } from '@prisma/client'
import { DateTime } from 'luxon'

export const setupSchema = z.object({
  language: z.string().length(2, NotificationCode.SETUP_INVALID_LANGUAGE),
  dbPassword: z.string().min(10, NotificationCode.SETUP_DATABASE_PASSWORD_TOO_SHORT),
  adminUsername: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length >= 2, { message: NotificationCode.SETUP_ADMIN_USERNAME_TOO_SHORT })
    .refine((val) => val.length <= 64, { message: NotificationCode.SETUP_ADMIN_USERNAME_TOO_LONG }),
  adminPassword: z.string().min(8, NotificationCode.SETUP_ADMIN_PASSWORD_TOO_SHORT)
})

export const editEMLATSchema = z.object({
  name: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length >= 2, { message: NotificationCode.EMLAT_NAME_TOO_SHORT })
    .refine((val) => val.length <= 64, { message: NotificationCode.EMLAT_NAME_TOO_LONG }),
  language: z.string().length(2, NotificationCode.EMLAT_INVALID_LANGUAGE),
  regeneratePin: z.boolean()
})

export const editUserSchema = z.object({
  userId: z.string(),
  username: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length >= 2, { message: NotificationCode.EDIT_USER_USERNAME_TOO_SHORT })
    .refine((val) => val.length <= 64, { message: NotificationCode.EDIT_USER_USERNAME_TOO_LONG }),
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
      .transform((val) => val.trim())
      .refine((val) => val.length >= 2, { message: NotificationCode.EDIT_ACCOUNT_USERNAME_TOO_SHORT })
      .refine((val) => val.length <= 64, { message: NotificationCode.EDIT_ACCOUNT_USERNAME_TOO_LONG }),
    password: z.string().optional()
  })
  .refine((schema) => !(schema.password && schema.password != '' && schema.password.length < 8), {
    error: NotificationCode.EDIT_ACCOUNT_PASSWORD_TOO_SHORT,
    path: ['password']
  })

export const loginSchema = z.object({
  username: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length >= 2, { message: NotificationCode.LOGIN_USERNAME_TOO_SHORT })
    .refine((val) => val.length <= 64, { message: NotificationCode.LOGIN_USERNAME_TOO_LONG }),
  password: z.string()
})

export const registerSchema = z.object({
  username: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length >= 2, { message: NotificationCode.REGISTER_USERNAME_TOO_SHORT })
    .refine((val) => val.length <= 64, { message: NotificationCode.REGISTER_USERNAME_TOO_LONG }),
  password: z.string().min(8, NotificationCode.REGISTER_PASSWORD_TOO_SHORT),
  pin: z.string().length(3, NotificationCode.REGISTER_PIN_INVALID)
})

export const uploadFilesSchema = z.object({
  currentPath: z.string(),
  files: z.array(z.instanceof(File))
})

export const renameFileSchema = z.object({
  path: z.string(),
  name: z.string().min(1, NotificationCode.INVALID_INPUT).max(255, NotificationCode.INVALID_INPUT),
  newName: z
    .string()
    .transform((val) => val.removeUnwantedFilenameChars())
    .refine((val) => val.length >= 1, { message: NotificationCode.INVALID_INPUT })
    .refine((val) => val.length <= 255, { message: NotificationCode.INVALID_INPUT })
})

export const createFileSchema = z
  .object({
    path: z.string(),
    name: z
      .string()
      .optional()
      .transform((val) => val?.removeUnwantedFilenameChars())
  })
  .refine((schema) => !(schema.name && (schema.name.length < 1 || schema.name.length > 255)), {
    error: NotificationCode.INVALID_INPUT,
    path: ['name']
  })

export const editFileSchema = z.object({
  path: z.string(),
  name: z.string().min(1, NotificationCode.INVALID_INPUT).max(255, NotificationCode.INVALID_INPUT),
  content: z.string()
})

export const loaderSchema = z.object({
  type: z.enum(LoaderType),
  minecraftVersion: z.string(),
  loaderVersion: z.string()
})

export const bootstrapsSchema = z.object({
  newVersion: z.string(),
  name: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length >= 2, { message: NotificationCode.EMLAT_NAME_TOO_SHORT })
    .refine((val) => val.length <= 64, { message: NotificationCode.EMLAT_NAME_TOO_LONG }),
  winFile: z.instanceof(File),
  macFile: z.instanceof(File),
  linFile: z.instanceof(File)
})

export const maintenanceSchema = z
  .object({
    startTime: z
      .string()
      .optional()
      .nullable()
      .transform((val) => (val ? new Date(DateTime.fromISO(val, { zone: 'utc' }).toLocal().toFormat('yyyy-MM-dd HH:mm')) : null)),
    endTime: z
      .string()
      .optional()
      .nullable()
      .transform((val) => (val ? new Date(DateTime.fromISO(val, { zone: 'utc' }).toLocal().toFormat('yyyy-MM-dd HH:mm')) : null)),
    message: z
      .string()
      .optional()
      .nullable()
      .transform((val) => val?.trim() ?? '')
  })
  .refine(
    (schema) => {
      if (schema.startTime && schema.endTime) {
        return schema.startTime < schema.endTime
      }
      return true
    },
    { error: NotificationCode.MAINTENANCE_INVALID_DATES }
  )

export const newsSchema = z.object({
  newsId: z.string().optional(),
  title: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length >= 1, { message: NotificationCode.NEWS_TITLE_TOO_SHORT })
    .refine((val) => val.length <= 255, { message: NotificationCode.NEWS_TITLE_TOO_LONG }),
  content: z.string(),
  categoriesId: z.array(z.string()).optional(),
  tagsId: z.array(z.string()).optional()
})

export const newsCategorySchema = z.object({
  categoryId: z.string().optional(),
  name: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length >= 1, { message: NotificationCode.NEWS_CATEGORY_NAME_TOO_SHORT })
    .refine((val) => val.length <= 64, { message: NotificationCode.NEWS_CATEGORY_NAME_TOO_LONG })
})

export const newsTagSchema = z.object({
  tagId: z.string().optional(),
  name: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length >= 1, { message: NotificationCode.NEWS_TAG_NAME_TOO_SHORT })
    .refine((val) => val.length <= 64, { message: NotificationCode.NEWS_TAG_NAME_TOO_LONG }),
  color: z.string()
})

export const backgroundSchema = z
  .object({
    backgroundId: z.string().optional(),
    name: z
      .string()
      .transform((val) => val.trim())
      .refine((val) => val.length >= 1, { message: NotificationCode.BACKGROUND_NAME_TOO_SHORT })
      .refine((val) => val.length <= 255, { message: NotificationCode.BACKGROUND_NAME_TOO_LONG }),
    status: z.enum(['ACTIVE', 'INACTIVE'], { error: NotificationCode.BACKGROUND_INVALID_STATUS }),
    file: z.instanceof(File).optional().or(z.string().optional().or(z.null()))
  })
  .refine((schema) => !(!schema.backgroundId && !schema.file), {
    message: NotificationCode.MISSING_INPUT
  })

