export class HttpError extends Error {
  status: number

  constructor(status: number) {
    super(`Request failed with status ${status}`)
    this.name = 'HttpError'
    this.status = status
  }
}

export const isAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === 'AbortError'

export async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal })
  if (!response.ok) throw new HttpError(response.status)
  return (await response.json()) as T
}
