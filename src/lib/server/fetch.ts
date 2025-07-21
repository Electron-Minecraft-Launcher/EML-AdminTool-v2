import { sleep } from '$lib/utils/utils'

const DELAY_MS = 600

export async function fetchServer(input: RequestInfo, init?: RequestInit) {
  await sleep(DELAY_MS)

  try {
    const res = await fetch(input, init)

    // Optionnel : si tu veux logguer les requêtes
    console.log(`[fetchServer] ${Date.now()} ${typeof input === 'string' ? input : input.toString()}: ${res.status}`)

    return res
  } catch (err) {
    console.error(`[fetchServer] Error fetching ${typeof input === 'string' ? input : input.toString()}`, err)
    throw err
  }
}

