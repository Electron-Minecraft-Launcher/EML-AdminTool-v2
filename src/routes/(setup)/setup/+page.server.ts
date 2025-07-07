import { error, fail, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { setupSchema } from '$lib/utils/validation'
import { initDatabase, changeDatabasePassword, setAdminUser, setLanguage, setPin } from '$lib/server/setup'
import { DatabaseError } from '$lib/utils/errors'

export const load = (async () => {
  return {}
}) satisfies PageServerLoad

export const actions: Actions = {
  setup: async (event) => {
    if (event.locals.isConfigured) {
      return fail(400, { failure: 'Already configured' })
    }

    const ip = event.getClientAddress()
    const form = await event.request.formData()
    
    const raw = {
      language: form.get('language')?.toString(),
      dbPassword: form.get('db-password')?.toString(),
      adminUsername: form.get('admin-username')?.toString(),
      adminPassword: form.get('admin-password')?.toString()
    }
    
    const result = setupSchema.safeParse(raw)
    
    if (!result.success) {
      console.log(raw)
      return fail(400, { failure: result.error.message })
    }

    const { language, dbPassword, adminUsername, adminPassword } = result.data

    try {
      await changeDatabasePassword(dbPassword)
      await initDatabase()
      await setAdminUser(adminUsername, adminPassword)
      await setPin()
      await setLanguage(language)

      return { success: true }
    } catch (err) {
      if (err instanceof DatabaseError) throw error(500)
      
      console.error('Setup error:', err)
      throw error(500)
    }
  }
}
