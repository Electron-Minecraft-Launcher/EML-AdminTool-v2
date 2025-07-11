import { goto } from "$app/navigation"

/**
 * @param duration Sleep duration in ms.
 */
export function sleep(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration))
}

/**
 * @param retrying Number of times to retry pinging the server. Default is `5`.
 */
export async function pingServerAndReload(retrying: number = 5) {
  await sleep(2000)
  for (let i = 0; i < retrying; i++) {
    try {
      const response = await fetch('/api/ping')
      if (response.ok) {
        goto('/')
        return
      }
    } catch (err) {
      console.error('Ping failed, retrying...', err)
    }
  }
  throw new Error('Failed to ping server after multiple attempts.')
}