import { useSearchStore } from '@/store/searchStore'
import { typeQuery } from './tasks/typeQuery'
import { useTermDebounce } from './useTermDebounce'

export function usePresenter() {
  const query = useSearchStore((state) => state.query)
  const search = useTermDebounce()

  const change = (value: string) => {
    typeQuery(value)
    search(value.trim())
  }

  return {
    query,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => change(event.target.value),
    onClear: () => change(''),
  }
}
