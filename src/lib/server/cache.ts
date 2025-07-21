const cache = new Map<string, { value: any; expiry: number }>()
const DEFAULT_TTL_SECONDS = 300 // 5 minutes

/**
 * Get a value from the cache or executes and stores it if it's missing or expired.
 * @param key Unique key for the cache entry.
 * @param resolver Asynchronous function that fetches the data to cache.
 * @param ttlSeconds Time to live in seconds.
 */
export async function getOrSet<T>(key: string, resolver: () => Promise<T>, ttlSeconds: number = DEFAULT_TTL_SECONDS): Promise<T> {
  const now = Date.now()
  const existing = cache.get(key)

  if (existing && now < existing.expiry) {
    console.debug(`[Cache] Hit for key: ${key}`)
    return existing.value as T
  }

  console.debug(`[Cache] Miss for key: ${key}, fetching new value...`)

  const freshValue = await resolver()
  cache.set(key, {
    value: freshValue,
    expiry: now + ttlSeconds * 1000
  })

  return freshValue
}

