import { type ApiErrorCode, isAbortError, toApiErrorCode } from '@/api/httpClient'
import { abortFetchShowsPage, fetchShowsPage } from '@/api/shows'
import { useSearchStore } from '@/store/searchStore'
import { useShowsStore } from '@/store/showsStore'

export const MIN_QUERY_LENGTH = 2

export interface LoadShowsResult {
  error: ApiErrorCode | null
}

/**
 * Загрузить страницу выдачи по текущим параметрам из стора. Вызывают задачи, которые
 * эти параметры меняют, и «Повторить». Устаревший запрос отменяет `api/`, отмена ошибкой не считается.
 */
export async function loadShows(): Promise<LoadShowsResult> {
  const { term, genre, page } = useSearchStore.getState()

  if (term.length < MIN_QUERY_LENGTH) {
    abortFetchShowsPage()
    useShowsStore.setState({ data: null, status: 'idle', error: null })
    return { error: null }
  }

  // старые данные остаются на экране, пока грузятся новые (нет мигания списка)
  useShowsStore.setState({ status: 'loading', error: null })
  try {
    const data = await fetchShowsPage({ query: term, genre, page })
    useShowsStore.setState({ data, status: 'success', error: null })
    return { error: null }
  } catch (error) {
    if (isAbortError(error)) return { error: null }

    const code = toApiErrorCode(error)
    useShowsStore.setState({ data: null, status: 'error', error: code })
    return { error: code }
  }
}
