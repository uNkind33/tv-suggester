import { useEffect, useRef } from 'react'
import { MIN_QUERY_LENGTH } from '@/ShowsExplorer/logic/tasks/loadShows'
import { searchByTerm } from './tasks/searchByTerm'

export const DEBOUNCE_MS = 400

/** Пауза во вводе перед поиском: task получает уже «устоявшийся» запрос. */
export function useTermDebounce() {
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  return (term: string) => {
    clearTimeout(timer.current)
    // короткий или очищенный запрос сбрасывает выдачу сразу, без ожидания паузы
    if (term.length < MIN_QUERY_LENGTH) {
      void searchByTerm(term)
      return
    }
    timer.current = setTimeout(() => void searchByTerm(term), DEBOUNCE_MS)
  }
}
