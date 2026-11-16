import { useEffect, useRef } from 'react'

export function usePresenter(count: number, onCancel: () => void) {
  const dialogRef = useRef<HTMLDivElement>(null)
  // элемент, с которого открыли окно: читаем при первом рендере, до того как autoFocus переведёт фокус внутрь
  const openerRef = useRef(document.activeElement)

  // окно закрыли: возвращаем фокус туда, откуда его открыли
  useEffect(() => {
    const opener = openerRef.current
    return () => (opener as HTMLElement | null)?.focus()
  }, [])

  // Esc закрывает окно, Tab не выпускает фокус за его пределы (на панель под ним)
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') return onCancel()
      if (event.key !== 'Tab') return

      const buttons = dialogRef.current?.querySelectorAll('button')
      if (!buttons?.length) return
      const first = buttons[0]
      const last = buttons[buttons.length - 1]
      const active = document.activeElement
      const isOutside = !dialogRef.current?.contains(active)

      if (isOutside || (event.shiftKey && active === first)) {
        event.preventDefault()
        ;(event.shiftKey ? last : first).focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onCancel])

  return { dialogRef, title: `Clear all ${count} favorites?` }
}
