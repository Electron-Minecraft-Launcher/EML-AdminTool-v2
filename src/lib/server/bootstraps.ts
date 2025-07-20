import { ServerError } from '$lib/utils/errors'
import { NotificationCode } from '$lib/utils/notifications'
import type { Bootstrap } from '@prisma/client'
import { db } from './db'
import { getFiles } from './files'

export async function getBootstraps() {
  try {
    const bootstraps = await db.bootstrap.findUnique({ where: { id: '1' } })
    return bootstraps
  } catch (err) {
    console.error('Failed to get bootstraps:', err)
    throw new ServerError('Failed to get bootstraps', err, NotificationCode.DATABASE_ERROR, 500)
  }
}

export async function updateBootstraps(newVersion: string, existingBootstraps: Bootstrap | null) {
  const files = await getFiles('', 'bootstraps')
  const winFile = files.find((file) => file.name.includes('win'))
  const macFile = files.find((file) => file.name.includes('mac'))
  const linFile = files.find((file) => file.name.includes('lin'))

  if (!winFile || !macFile || !linFile) {
    throw new ServerError('Missing bootstrap files', null, NotificationCode.FILE_SYSTEM_ERROR, 500)
  }

  try {
    if (existingBootstraps) {
      await db.bootstrap.update({
        where: { id: existingBootstraps.id },
        data: {
          version: newVersion,
          winFile: winFile as any,
          macFile: macFile as any,
          linFile: linFile as any
        }
      })
    } else {
      await db.bootstrap.create({
        data: {
          id: '1',
          version: newVersion,
          winFile: winFile as any,
          macFile: macFile as any,
          linFile: linFile as any
        }
      })
    }
  } catch (err) {
    console.error('Failed to update bootstraps:', err)
    throw new ServerError('Failed to update bootstraps', err, NotificationCode.DATABASE_ERROR, 500)
  }
}

