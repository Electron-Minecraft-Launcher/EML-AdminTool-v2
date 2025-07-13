import type { File } from '$lib/utils/types'
import type { PageServerLoad } from './$types'

export const load = (async () => {
  let files: File[] = []
  return { files }
}) satisfies PageServerLoad
