type F = (...args: any[]) => any

/** Throttle consecutive executions of the provided function by the
given time in milliseconds. */
export default function useThrottle(func: F, ms: number) {
  let lastExec = 0

  const throttledFunction: F = (...args: any[]) => {
    const elapsed = Date.now() - lastExec
    if (elapsed >= ms) {
      lastExec = Date.now()
      return func(...args)
    }
  }

  return throttledFunction
}
