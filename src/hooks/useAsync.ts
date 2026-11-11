import { useCallback, useEffect, useReducer, useState } from 'react'
import { isAbortError } from '@/api/httpClient'
import { deleteCached, getCached, setCached } from '@/lib/queryCache'

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'

interface State<T> {
  status: AsyncStatus
  data: T | undefined
  error: Error | null
}

type Action<T> =
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'success'; data: T }
  | { type: 'error'; error: Error }

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'idle':
      return { status: 'idle', data: undefined, error: null }
    case 'loading':
      // старые данные остаются, пока грузятся новые (нет мигания списка)
      return { ...state, status: 'loading', error: null }
    case 'success':
      return { status: 'success', data: action.data, error: null }
    case 'error':
      return { status: 'error', data: undefined, error: action.error }
  }
}

/**
 * Самописный аналог useQuery: отмена предыдущего запроса через AbortController,
 * защита от гонок, кэш по ключу, ручной retry.
 */
export function useAsync<T>(
  key: string | null,
  fetcher: (signal: AbortSignal) => Promise<T>,
) {
  const [state, dispatch] = useReducer(reducer<T>, {
    status: 'idle',
    data: undefined,
    error: null,
  })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (key === null) {
      dispatch({ type: 'idle' })
      return
    }
    const cached = getCached<T>(key)
    if (cached !== undefined) {
      dispatch({ type: 'success', data: cached })
      return
    }

    const controller = new AbortController()
    dispatch({ type: 'loading' })
    fetcher(controller.signal)
      .then((data) => {
        setCached(key, data)
        dispatch({ type: 'success', data })
      })
      .catch((error: unknown) => {
        if (isAbortError(error)) return // запрос отменён нами — не ошибка
        dispatch({ type: 'error', error: error as Error })
      })

    return () => controller.abort()
    // fetcher намеренно вне зависимостей: запрос определяется ключом
    // oxlint-disable-next-line react/exhaustive-deps
  }, [key, attempt])

  const retry = useCallback(() => {
    if (key !== null) deleteCached(key) // повтор всегда идёт в сеть, а не в кэш
    setAttempt((n) => n + 1)
  }, [key])

  return { ...state, retry }
}
