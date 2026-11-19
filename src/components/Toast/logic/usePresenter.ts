import { useEffect } from 'react'
import { useToastStore } from '@/store/toastStore'
import { hideToast } from '@/tasks/hideToast'
import { getToastIcon } from './getToastIcon'
import { getToastText } from './getToastText'

export const TOAST_MS = 3000

export function usePresenter() {
  const toast = useToastStore((state) => state.current)
  const toastId = toast?.id

  // таймер автоскрытия — реакция интерфейса, поэтому он здесь, а не в задаче;
  // новое уведомление меняет toastId, и cleanup снимает таймер прошлого
  useEffect(() => {
    if (toastId === undefined) return
    const timer = setTimeout(hideToast, TOAST_MS)
    return () => clearTimeout(timer)
  }, [toastId])

  return {
    key: toastId,
    isVisible: toast !== null,
    kind: toast?.kind,
    icon: toast ? getToastIcon(toast.kind) : '',
    text: toast ? getToastText(toast) : '',
    close: hideToast,
  }
}
