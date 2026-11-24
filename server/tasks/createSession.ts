import { randomUUID } from 'node:crypto'
import type { ErrorCode, Session } from '@shared/api'
import { isValidEmail, normalizeEmail } from '@/lib/email'
import { saveSession } from '@/storage/sessions'

export type CreateSessionResult = { error: null; session: Session } | { error: ErrorCode }

/** Вход по одному email, без пароля. Тот же email — тот же пользователь и тот же список избранного. */
export function createSession(rawEmail: string): CreateSessionResult {
  const email = normalizeEmail(rawEmail)
  if (!isValidEmail(email)) return { error: 'bad-request' }

  const token = randomUUID()
  saveSession(token, email)
  return { error: null, session: { token, email } }
}
