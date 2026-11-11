// Минимальный in-memory кэш ответов: ключ -> данные.
const cache = new Map<string, unknown>()

export const getCached = <T>(key: string): T | undefined => cache.get(key) as T | undefined

export const setCached = <T>(key: string, value: T): void => {
  cache.set(key, value)
}

export const deleteCached = (key: string): void => {
  cache.delete(key)
}
