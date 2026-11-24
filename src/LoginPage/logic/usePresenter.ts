import { MAX_EMAIL_LENGTH } from '@shared/api'
import { type ChangeEvent, type FormEvent, useState } from 'react'
import type { ApiErrorCode } from '@/lib/apiErrorCode'
import { HOME_PATH } from '@/lib/paths'
import { useAuthStore } from '@/store/authStore'
import { showToast } from '@/tasks/showToast'
import { getLoginErrorText } from './getLoginErrorText'
import { login } from './tasks/login'

export function usePresenter() {
  const isLoggedIn = useAuthStore((state) => state.user !== null)
  const [email, setEmail] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [errorCode, setErrorCode] = useState<ApiErrorCode | null>(null)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (isPending) return
    setIsPending(true)
    setErrorCode(null)

    const result = await login(email)
    // успех: user появился в store, View сама уходит на главную
    setIsPending(false)
    if (result.error) setErrorCode(result.error)
    else if (result.favoritesError) showToast('favorites-load-error')
  }

  return {
    isLoggedIn,
    homePath: HOME_PATH,
    email,
    maxLength: MAX_EMAIL_LENGTH,
    onEmailChange: (event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value),
    onSubmit,
    isPending,
    hasError: errorCode !== null,
    errorText: errorCode ? getLoginErrorText(errorCode) : null,
    submitLabel: isPending ? 'Logging in…' : 'Log in',
  }
}
