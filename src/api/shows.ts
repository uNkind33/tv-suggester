import type { ShowsPage } from '@shared/api'
import { request } from './httpClient'

interface Params {
  query: string
  genre: string | null
  page: number
}

// Одновременно идёт один поиск, поэтому владелец отмены — этот модуль, а не задачи:
// запрос из пагинации должен отменить и запрос из поиска.
let controller: AbortController | null = null

/** Одна страница выдачи: фильтр по жанру и пагинация считаются на backend. */
export async function fetchShowsPage({ query, genre, page }: Params): Promise<ShowsPage> {
  abortFetchShowsPage()
  const current = new AbortController()
  controller = current

  const params = new URLSearchParams({ q: query, page: String(page) })
  if (genre) params.set('genre', genre)
  const result = await request<ShowsPage>(`/api/shows?${params}`, { signal: current.signal })
  // ответ мог успеть прийти, но после него уже ушёл новый запрос
  current.signal.throwIfAborted()
  return result
}

/** Отменить текущий поиск, не начиная новый: например, когда поле очистили. */
export function abortFetchShowsPage(): void {
  controller?.abort()
  controller = null
}
