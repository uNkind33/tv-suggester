import { usePresenter } from './usePresenter'

interface Props {
  label: string
  active: boolean
  onClick: () => void
}

export default function GenreChip({ label, active, onClick }: Props) {
  const { className } = usePresenter(active)

  return (
    <button className={className} onClick={onClick} aria-pressed={active}>
      {label}
    </button>
  )
}
