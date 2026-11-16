import type { ToastKind } from '@/store/toastStore'

const TOAST_ICONS: Record<ToastKind, string> = {
  'favorite-added': '★',
  'favorite-removed': '✕',
  'favorite-error': '!',
  'favorites-load-error': '!',
}

export const getToastIcon = (kind: ToastKind): string => TOAST_ICONS[kind]
