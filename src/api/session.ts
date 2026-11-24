const TOKEN_KEY = 'tv-token'

function readStored(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

/** Токен входа: владелец один — api/. Хранится в памяти и в localStorage, чтобы пережить перезагрузку. */
let token = readStored()

export const getToken = (): string | null => token

export function setToken(value: string): void {
  token = value
  try {
    localStorage.setItem(TOKEN_KEY, value)
  } catch {
    // хранилище недоступно: вход продержится до перезагрузки страницы
  }
}

export function clearToken(): void {
  token = null
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    // нечего чистить
  }
}
