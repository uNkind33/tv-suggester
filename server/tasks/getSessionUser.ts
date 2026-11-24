import type { User } from '@shared/api'
import { findSessionEmail } from '@/storage/sessions'

/** Кто стоит за токеном; `null` — токена нет или сессия неизвестна (например, сервер перезапускали). */
export function getSessionUser(token: string | null): User | null {
  const email = token ? findSessionEmail(token) : undefined
  return email ? { email } : null
}
