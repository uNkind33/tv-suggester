import type { Show } from '@shared/api'

const BASE_URL = 'https://api.tvmaze.com'
export const REQUEST_TIMEOUT_MS = 10_000

/** TVmaze ответил, но с ошибкой. Сетевой сбой приходит обычной ошибкой fetch. */
export class TvmazeError extends Error {
  status: number

  constructor(status: number) {
    super(`TVmaze responded with status ${status}`)
    this.name = 'TvmazeError'
    this.status = status
  }
}

/** Оставляем только поля из контракта: TVmaze отдаёт гораздо больше. */
const toShow = (raw: Show): Show => ({
  id: raw.id,
  name: raw.name,
  genres: raw.genres,
  status: raw.status,
  premiered: raw.premiered,
  rating: { average: raw.rating.average },
  image: raw.image && { medium: raw.image.medium, original: raw.image.original },
  summary: raw.summary,
})

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) })
  if (!response.ok) throw new TvmazeError(response.status)
  return (await response.json()) as T
}

/** Единственное место, где backend ходит в TVmaze. Имена по транспортному действию. */
export async function fetchShows(term: string): Promise<Show[]> {
  const results = await request<{ show: Show }[]>(`/search/shows?q=${encodeURIComponent(term)}`)
  return results.map((result) => toShow(result.show))
}

export async function fetchShow(id: number): Promise<Show> {
  return toShow(await request<Show>(`/shows/${id}`))
}
