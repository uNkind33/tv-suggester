import type { ApiErrorCode } from '@/api/httpClient'

const ERROR_TEXTS: Record<ApiErrorCode, string> = {
  network: 'Can’t reach the server. Check your connection.',
  upstream: 'The shows service isn’t responding. Try again in a moment.',
  'not-found': 'Nothing was found for this request.',
  'bad-request': 'The request was not valid.',
  server: 'Something went wrong on the server.',
}

export const getErrorText = (error: ApiErrorCode | null): string =>
  ERROR_TEXTS[error ?? 'server']
