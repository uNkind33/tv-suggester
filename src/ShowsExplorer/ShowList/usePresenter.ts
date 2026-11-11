import type { Show } from '@/api/types'
import type { AsyncStatus } from '@/hooks/useAsync'
import { useSearchStore } from '@/store/searchStore'

export type ListView = 'hint' | 'skeleton' | 'error' | 'empty' | 'list'

export function usePresenter(shows: Show[], status: AsyncStatus) {
  const query = useSearchStore((state) => state.query.trim())

  let view: ListView = 'list'
  if (status === 'idle') view = 'hint'
  else if (status === 'error') view = 'error'
  else if (shows.length === 0) view = status === 'loading' ? 'skeleton' : 'empty'

  return { view, query, dimmed: status === 'loading' }
}
