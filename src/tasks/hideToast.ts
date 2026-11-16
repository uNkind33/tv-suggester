import { useToastStore } from '@/store/toastStore'

export function hideToast(): void {
  useToastStore.setState({ current: null })
}
