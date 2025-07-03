/**
 * @param duration Sleep duration in ms.
 */
export function sleep(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration))
}
