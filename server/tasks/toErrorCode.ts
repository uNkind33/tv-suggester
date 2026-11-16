import type { ErrorCode } from '@shared/api'
import { TvmazeError } from '@/api/tvmaze'

/** Исключение при обращении к TVmaze -> код ошибки. Сетевой сбой тоже `upstream`. */
export function toErrorCode(error: unknown): ErrorCode {
  if (error instanceof TvmazeError) return error.status === 404 ? 'not-found' : 'upstream'
  // не ответ TVmaze (сеть, таймаут или наш баг): клиенту — `upstream`, но в лог пишем причину
  console.error('[tvmaze] request failed', error)
  return 'upstream'
}
