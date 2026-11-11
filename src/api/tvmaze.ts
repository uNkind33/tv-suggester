import { getJson } from './httpClient'
import type { SearchResult, Show } from './types'

const BASE_URL = 'https://api.tvmaze.com'

export async function searchShows(query: string, signal?: AbortSignal): Promise<Show[]> {
  const url = `${BASE_URL}/search/shows?q=${encodeURIComponent(query)}`
  const results = await getJson<SearchResult[]>(url, signal)
  return results.map((result) => result.show)
}
