/** Ответы TVmaze в памяти процесса. Срок жизни записи проверяет задача, а не хранилище. */
interface CacheEntry {
  data: unknown
  savedAt: number
}

const cache: Record<string, CacheEntry> = {}

export const readCache = (key: string): CacheEntry | undefined => cache[key]

export const writeCache = (key: string, data: unknown, savedAt: number): void => {
  cache[key] = { data, savedAt }
}
