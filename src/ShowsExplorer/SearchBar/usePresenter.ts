import { useSearchStore } from '../../store/searchStore'

export function usePresenter() {
  const query = useSearchStore((state) => state.query)
  const setQuery = useSearchStore((state) => state.setQuery)

  return {
    query,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value),
    onClear: () => setQuery(''),
  }
}
