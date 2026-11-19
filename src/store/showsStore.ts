import type { ShowsPage } from '@shared/api'
import { create } from 'zustand'
import type { ApiErrorCode } from '@/api/httpClient'

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'

interface ShowsState {
  /** Последняя успешная страница: пока грузится новая, не стирается. */
  data: ShowsPage | null
  status: AsyncStatus
  error: ApiErrorCode | null
}

export const useShowsStore = create<ShowsState>(() => ({
  data: null,
  status: 'idle',
  error: null,
}))
