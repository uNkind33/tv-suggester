import type { Show } from '@shared/api'
import { create } from 'zustand'

interface FavoritesState {
  items: Show[]
}

export const useFavoritesStore = create<FavoritesState>(() => ({ items: [] }))
