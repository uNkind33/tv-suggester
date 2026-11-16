import type { ErrorCode } from '@shared/api'

export const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? ''

/** Что пошло не так при обращении к серверу. Текст для пользователя делает Presenter. */
export type ApiErrorCode = ErrorCode | 'network'

const SERVER_CODES: ApiErrorCode[] = ['bad-request', 'not-found', 'upstream', 'server']

export class ApiError extends Error {
  code: ApiErrorCode

  constructor(code: ApiErrorCode) {
    super(`API request failed: ${code}`)
    this.name = 'ApiError'
    this.code = code
  }
}

/** Запрос отменили: это не ошибка, задача молча выходит. */
export const isAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === 'AbortError'

/** Код любой ошибки запроса: ApiError несёт свой, остальное считаем сетевым сбоем. */
export const toApiErrorCode = (error: unknown): ApiErrorCode =>
  error instanceof ApiError ? error.code : 'network'

/** Запрос к нашему API. Любой сбой приходит как ApiError с кодом, кроме отмены. */
export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, init)
  } catch (error) {
    if (init?.signal?.aborted) throw error
    throw new ApiError('network')
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: ApiErrorCode } | null
    const code = body?.error
    throw new ApiError(code && SERVER_CODES.includes(code) ? code : 'server')
  }
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}
