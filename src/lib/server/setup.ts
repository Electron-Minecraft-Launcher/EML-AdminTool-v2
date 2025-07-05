import { Client } from 'pg'
import { exec } from 'child_process'
import { promisify } from 'util'
import { config } from 'dotenv'
import { DatabaseError } from '$lib/utils/errors'
import path from 'path'
import { randomBytes } from 'crypto'
import fs from 'fs'
import pkg from '../../../package.json'

const execAsync = promisify(exec)

export async function changeDatabasePassword(newPassword: string): Promise<void> {
  config()

  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()

  try {
    await client.query(`ALTER USER eml WITH PASSWORD $1`, [newPassword])
  } catch (err) {
    console.error('Error changing database password:', err)
    await client.end()
    throw new DatabaseError('Failed to change database password')
  }

  await client.end()

  await updateEnv(newPassword)
}

export async function initDatabase(): Promise<void> {
  config()

  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()

  let res
  try {
    res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, ['eml_admintool'])
  } catch (err) {
    console.error('Error checking database existence:', err)
    await client.end()
    throw new DatabaseError('Database check failed')
  }

  if (res.rowCount === 0) {
    try {
      await client.query(`CREATE DATABASE "eml_admintool"`)
    } catch (err) {
      console.error('Error creating database:', err)
      await client.end()
      throw new DatabaseError('Database creation failed')
    }
  }

  await execAsync('npx prisma db push')

  try {
    // check if a line existe in the Environment table
    res = await client.query(`SELECT 1 FROM "Environment" WHERE id = $1`, [1])
    if (res.rowCount === 0) {
      await client.query(`INSERT INTO "Environment" (id, language, name, theme, version) VALUES ($1, 'en', 'EML', 'default', $2)`, [1, pkg.version])
    } else {
      await client.query(`UPDATE "Environment" SET version = $1 WHERE id = $2`, [pkg.version, 1])
    }
  } catch (err) {
    console.error('Error initializing Environment table:', err)
    await client.end()
    throw new DatabaseError('Failed to initialize Environment table')
  }

  await client.end()
}

export async function setAdminUser(username: string, password: string): Promise<void> {
  config()

  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()

  try {
    await client.query(
      `INSERT INTO "User" 
      (username, password, status, isAdmin, p_filesUpdater, p_loader, p_bootstraps, p_maintenance, p_news, p_newsCategories, p_newsTags, p_backgrounds, p_stats, createdAt, updatedAt)
      VALUES ($1, $2, 'ACTIVE', true, 1, 1, 1, 1, 2, 1, 1, 1, 2, NOW(), NOW()) ON CONFLICT DO NOTHING`,
      [username, password]
    )
    await client.query('UPDATE "Environment" SET name = $1 WHERE id = 1', [username])
  } catch (err) {
    console.error('Error initializing admin user:', err)
    await client.end()
    throw new DatabaseError('Failed to initialize admin user')
  }

  await client.end()
}

export async function setLanguage(language: string): Promise<void> {
  config()

  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()

  try {
    await client.query(`UPDATE "Environment" SET language = $1 WHERE id = 1`, [language])
  } catch (err) {
    console.error('Error setting language:', err)
    await client.end()
    throw new DatabaseError('Failed to set language')
  }

  await client.end()
}

export async function markAsConfigured(): Promise<void> {
  config()
  const databaseUrl = process.env.DATABASE_URL || 'postgresql://eml:eml@db:5432/eml_admintool'
  const jwtSecretKey = process.env.JWT_SECRET_KEY || randomBytes(64).toString('base64url')

  const envFile = path.resolve(__dirname, '../../env/.env')

  const newEnv = `# # # # # # # # # # # # # # # # # # # # # # # # # # # #
#          DO NOT MODIFY OR DELETE THIS FILE          #
#                                                     #
# This file contains important environment variables  #
# for your application, including the password for    #
# your database and a JWT key. Modifying or deleting  #
# this file would break your application and          #
# compromise its security.                            #
#                                                     #
# If you need to change any of these values, please   #
# use the appropriate configuration options rather    #
# than modifying this file directly.                  #
# Consult the documentation for more information.     #
# # # # # # # # # # # # # # # # # # # # # # # # # # # #

IS_CONFIGURED="true"
DATABASE_URL="${databaseUrl}"
JWT_SECRET_KEY="${jwtSecretKey}"`

  fs.writeFileSync(envFile, newEnv)

  config()
}

async function updateEnv(dbPassword: string) {
  config()
  const isConfigured = process.env.IS_CONFIGURED === 'true'

  const envFile = path.resolve(__dirname, '../../env/.env')

  const newDatabaseUrl = `postgresql://eml:${dbPassword}@db:5432/eml_admintool`
  const newJwtSecretKey = randomBytes(64).toString('base64url')

  const newEnv = `# # # # # # # # # # # # # # # # # # # # # # # # # # # #
#          DO NOT MODIFY OR DELETE THIS FILE          #
#                                                     #
# This file contains important environment variables  #
# for your application, including the password for    #
# your database and a JWT key. Modifying or deleting  #
# this file would break your application and          #
# compromise its security.                            #
#                                                     #
# If you need to change any of these values, please   #
# use the appropriate configuration options rather    #
# than modifying this file directly.                  #
# Consult the documentation for more information.     #
# # # # # # # # # # # # # # # # # # # # # # # # # # # #

IS_CONFIGURED="${isConfigured}"
DATABASE_URL="${newDatabaseUrl}"
JWT_SECRET_KEY="${newJwtSecretKey}"`

  fs.writeFileSync(envFile, newEnv)

  config()
}
