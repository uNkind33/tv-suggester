import { create } from 'zustand'

/** Что случилось — данные, а не текст: текст собирает Presenter компонента Toast. */
export type ToastKind =
  | 'favorite-added'
  | 'favorite-removed'
  | 'favorite-error'
  | 'favorites-load-error'

export interface Toast {
  /** Новый id на каждый показ: повторное одинаковое уведомление перезапускает таймер. */
  id: number
  kind: ToastKind
  showName: string
}

interface ToastState {
  current: Toast | null
  lastId: number
}

export const useToastStore = create<ToastState>(() => ({ current: null, lastId: 0 }))
