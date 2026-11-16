import type { Toast } from '@/store/toastStore'

export function getToastText({ kind, showName }: Toast): string {
  switch (kind) {
    case 'favorite-added':
      return `Added “${showName}” to favorites`
    case 'favorite-removed':
      return `Removed “${showName}” from favorites`
    case 'favorite-error':
      return `Couldn’t update favorites for “${showName}”`
    case 'favorites-load-error':
      return 'Couldn’t load your favorites'
  }
}
