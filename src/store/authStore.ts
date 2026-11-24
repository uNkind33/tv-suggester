import type { User } from '@shared/api'
import { create } from 'zustand'

interface AuthState {
  /** Кто вошёл; `null` — гость. */
  user: User | null
}

export const useAuthStore = create<AuthState>(() => ({ user: null }))
