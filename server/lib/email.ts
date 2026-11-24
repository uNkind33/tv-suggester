import { MAX_EMAIL_LENGTH } from '@shared/api'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** `Bob@Mail.com ` и `bob@mail.com` — один пользователь, а значит, один список избранного. */
export const normalizeEmail = (value: string): string => value.trim().toLowerCase()

export const isValidEmail = (value: string): boolean =>
  value.length <= MAX_EMAIL_LENGTH && EMAIL_PATTERN.test(value)
