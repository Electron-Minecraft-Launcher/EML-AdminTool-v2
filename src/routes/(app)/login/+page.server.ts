import type { Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async () => {
  return {}
}) satisfies PageServerLoad

export const actions: Actions = {
  login: async (event) => {
    const ip = event.getClientAddress()
    const form = await event.request.formData()

    const raw = {
      username: form.get('username')?.toString(),
      password: form.get('password')?.toString()
    }
  }
}

