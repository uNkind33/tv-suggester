import type { Show } from '@/api/types'

export function extractGenres(shows: Show[]): string[] {
  const unique = new Set(shows.flatMap((show) => show.genres))
  return [...unique].sort((a, b) => a.localeCompare(b))
}

export function filterByGenre(shows: Show[], genre: string | null): Show[] {
  if (!genre) return shows
  return shows.filter((show) => show.genres.includes(genre))
}
