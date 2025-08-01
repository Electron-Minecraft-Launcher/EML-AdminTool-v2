import pkg from '@prisma/client'
import type { PrismaClient as PClient } from '@prisma/client'
const { PrismaClient } = pkg

const globalForPrisma = globalThis as unknown as { prisma: PClient }

export const db = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
