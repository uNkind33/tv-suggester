import type { ApiErrorCode } from '@/lib/apiErrorCode'

export function getLoginErrorText(code: ApiErrorCode): string {
  switch (code) {
    case 'bad-request':
      return 'Enter a valid email address'
    case 'network':
      return 'Can’t reach the server. Check your connection and try again'
    default:
      return 'Couldn’t log in. Try again in a moment'
  }
}
