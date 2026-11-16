import { MIN_QUERY_LENGTH, type Show } from '@shared/api'
import type { ApiErrorCode } from '@/api/httpClient'
import { useSearchStore } from '@/store/searchStore'
import type { AsyncStatus } from '@/store/showsStore'
import { getErrorText } from './getErrorText'

export type ListView = 'hint' | 'skeleton' | 'error' | 'empty' | 'list'

export function usePresenter(shows: Show[], status: AsyncStatus, error: ApiErrorCode | null) {
  const query = useSearchStore((state) => state.term)

  let view: ListView = 'list'
  if (status === 'idle') view = 'hint'
  else if (status === 'error') view = 'error'
  else if (shows.length === 0) view = status === 'loading' ? 'skeleton' : 'empty'

  return {
    view,
    dimmed: status === 'loading',
    hintText: `At least ${MIN_QUERY_LENGTH} characters.`,
    emptyText: `No results for “${query}”.`,
    errorText: getErrorText(error),
  }
}
