import { type ErrorCode, MIN_QUERY_LENGTH, type Show, type ShowsPage } from '@shared/api'
import { fetchShows } from '@/api/tvmaze'
import { extractGenres, filterByGenre } from '@/lib/genres'
import { pageCount, paginate } from '@/lib/paginate'
import { getCached } from './getCached'
import { toErrorCode } from './toErrorCode'

interface Params {
  query: string
  genre: string | null
  page: number
}

export type SearchShowsResult = { error: null; data: ShowsPage } | { error: ErrorCode }

/** Поиск: TVmaze (с кэшем) -> жанры всей выдачи -> фильтр по жанру -> страница. */
export async function searchShows({ query, genre, page }: Params): Promise<SearchShowsResult> {
  const term = query.trim().toLowerCase()
  if (term.length < MIN_QUERY_LENGTH) return { error: 'bad-request' }

  try {
    const shows = await getCached(`search:${term}`, () => fetchShows(term))
    return { error: null, data: buildPage(shows, genre, page) }
  } catch (error) {
    return { error: toErrorCode(error) }
  }
}

function buildPage(shows: Show[], genre: string | null, page: number): ShowsPage {
  const filtered = filterByGenre(shows, genre)
  const totalPages = pageCount(filtered.length)
  const safePage = Math.min(Math.max(1, page), totalPages)

  return {
    items: paginate(filtered, safePage),
    genres: extractGenres(shows),
    page: safePage,
    totalPages,
    total: filtered.length,
  }
}
