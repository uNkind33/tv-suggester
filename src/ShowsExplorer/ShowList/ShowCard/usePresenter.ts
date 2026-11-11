import type { Show } from '../../../api/types'

export function usePresenter(show: Show) {
  const rating = show.rating.average

  return {
    posterUrl: show.image?.original ?? null,
    initial: show.name[0],
    year: show.premiered?.slice(0, 4) ?? null,
    ratingLabel: rating === null ? null : `★ ${rating}`,
    genresLabel: show.genres.join(' · '),
  }
}
