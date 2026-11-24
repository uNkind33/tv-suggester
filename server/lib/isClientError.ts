/** Ошибка из-за самого запроса (битый или слишком большой JSON), а не наша: у таких `status` 4xx. */
export function isClientError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null || !('status' in error)) return false
  return typeof error.status === 'number' && error.status >= 400 && error.status < 500
}
