import type { ErrorCode } from '@shared/api'
import { TvmazeError } from '@/api/tvmaze'

/** Исключение при обращении к TVmaze -> код ошибки. Сетевой сбой тоже `upstream`. */
export function toErrorCode(error: unknown): ErrorCode {
  if (error instanceof TvmazeError && error.status === 404) return 'not-found'
  return 'upstream'
}
