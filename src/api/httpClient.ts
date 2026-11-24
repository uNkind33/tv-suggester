import { ERROR_CODES, type ErrorCode } from '@shared/api'
import type { ApiErrorCode } from '@/lib/apiErrorCode'
import { getToken } from './session'

/** Дольше этого запрос считаем потерянным (`network`): запас над таймаутом backend к TVmaze (10 с). */
export const REQUEST_TIMEOUT_MS = 15_000

export const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? ''

const isErrorCode = (value: unknown): value is ErrorCode =>
  ERROR_CODES.some((code) => code === value)

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

/** Запрос к нашему API (токен входа добавляется сам, таймаут тоже). Любой сбой приходит как ApiError с кодом, кроме отмены. */
export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  // отмена вызывающего и таймаут объединяются в один сигнал
  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS)
  const signal = init?.signal ? AbortSignal.any([init.signal, timeout]) : timeout

  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, { ...init, headers, signal })
  } catch (error) {
    if (init?.signal?.aborted) throw error
    throw new ApiError('network')
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: ApiErrorCode } | null
    const code = body?.error
    throw new ApiError(isErrorCode(code) ? code : 'server')
  }
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}
