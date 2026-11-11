export interface Show {
  id: number
  name: string
  genres: string[]
  status: string
  premiered: string | null
  rating: { average: number | null }
  image: { medium: string; original: string } | null
  summary: string | null
}

export interface SearchResult {
  score: number
  show: Show
}
