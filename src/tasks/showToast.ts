import { type ToastKind, useToastStore } from '@/store/toastStore'

export function showToast(kind: ToastKind, showName = ''): void {
  const id = useToastStore.getState().lastId + 1
  useToastStore.setState({ lastId: id, current: { id, kind, showName } })
}
