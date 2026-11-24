/** Сессии в памяти процесса: токен -> email. После перезапуска сервера все входят заново. */
const sessions: Record<string, string> = {}

/** Токен приходит из заголовка, то есть от клиента: `constructor` или `__proto__` не должны находиться как «свои» ключи. */
export const findSessionEmail = (token: string): string | undefined =>
  Object.hasOwn(sessions, token) ? sessions[token] : undefined

export const saveSession = (token: string, email: string): void => {
  sessions[token] = email
}

export const deleteSession = (token: string): void => {
  delete sessions[token]
}
