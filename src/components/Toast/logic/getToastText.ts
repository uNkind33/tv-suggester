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
    case 'favorites-cleared':
      return 'Favorites cleared'
    case 'favorites-clear-error':
      return 'Couldn’t clear your favorites'
    case 'login-required':
      return 'Log in to save favorites'
    case 'session-restore-error':
      return 'Couldn’t check your login. Reload the page to try again'
  }
}
