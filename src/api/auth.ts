import type { Session, User } from '@shared/api'
import { request } from './httpClient'

export const postLogin = (email: string) =>
  request<Session>('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })

export const fetchCurrentUser = () => request<User>('/api/auth/me')

export const postLogout = () => request<void>('/api/auth/logout', { method: 'POST' })
