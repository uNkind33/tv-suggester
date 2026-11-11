import { searchShows } from '../api/tvmaze'
import { useAsync } from '../hooks/useAsync'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useSearchStore } from '../store/searchStore'

export const DEBOUNCE_MS = 400
export const MIN_QUERY_LENGTH = 2

/** Данные для экрана: debounce -> запрос с отменой -> { shows, status, error, retry }. */
export function useShows() {
  const query = useSearchStore((state) => state.query)
  const debounced = useDebouncedValue(query.trim(), DEBOUNCE_MS)
  const key = debounced.length >= MIN_QUERY_LENGTH ? debounced.toLowerCase() : null

  const { data, status, error, retry } = useAsync(key, (signal) =>
    searchShows(debounced, signal),
  )

  return { shows: data ?? [], status, error, retry }
}
