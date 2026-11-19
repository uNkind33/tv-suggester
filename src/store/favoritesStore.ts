import type { Show } from '@shared/api'
import { create } from 'zustand'

interface FavoritesState {
  items: Show[]
  /** Шоу, чей запрос на сервер сейчас идёт: общий для звёздочки и панели, чтобы клики не пересекались. */
  pendingIds: number[]
  /** Что пользователь менял с последней загрузки списка: `Show` — добавил, `null` — убрал. */
  changes: Record<number, Show | null>
}

export const useFavoritesStore = create<FavoritesState>(() => ({
  items: [],
  pendingIds: [],
  changes: {},
}))
