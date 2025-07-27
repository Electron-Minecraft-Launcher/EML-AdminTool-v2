import pkg from '@prisma/client'
const { PrismaClient } = pkg

const globalForPrisma = globalThis as unknown as { prisma: typeof PrismaClient }

export const db = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

