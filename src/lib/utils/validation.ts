import { z } from 'zod/v4'
import { NotificationMessage } from './notifications'

export const setupSchema = z.object({
  language: z.string().length(2, NotificationMessage.setup.LANGUAGE_LENGTH),
  dbPassword: z.string().min(10, NotificationMessage.setup.DB_PASSWORD_MIN_LENGTH),
  adminUsername: z.string().min(2, NotificationMessage.setup.ADMIN_USERNAME_MIN_LENGTH).transform((val) => val.trim()),
  adminPassword: z.string().min(8, NotificationMessage.setup.ADMIN_PASSWORD_MIN_LENGTH)
})
