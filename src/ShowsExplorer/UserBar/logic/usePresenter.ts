import { useState } from 'react'
import { LOGIN_PATH } from '@/lib/paths'
import { useAuthStore } from '@/store/authStore'
import { logout } from './tasks/logout'

export function usePresenter() {
  const email = useAuthStore((state) => state.user?.email ?? null)
  const [isPending, setIsPending] = useState(false)

  const onLogout = async () => {
    if (isPending) return
    setIsPending(true)
    await logout()
    setIsPending(false)
  }

  return {
    isLoggedIn: email !== null,
    email,
    loginPath: LOGIN_PATH,
    logoutLabel: isPending ? 'Logging out…' : 'Log out',
    isPending,
    onLogout,
  }
}
