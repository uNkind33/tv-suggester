import type { Show } from '../../api/types'
import { useSearchStore } from '../../store/searchStore'

type Status = 'idle' | 'loading' | 'success' | 'error'

export type ListView = 'hint' | 'skeleton' | 'error' | 'empty' | 'list'

export function usePresenter(shows: Show[], status: Status) {
  const query = useSearchStore((state) => state.query.trim())

  let view: ListView = 'list'
  if (status === 'idle') view = 'hint'
  else if (status === 'error') view = 'error'
  else if (shows.length === 0) view = status === 'loading' ? 'skeleton' : 'empty'

  return { view, query, dimmed: status === 'loading' }
}
