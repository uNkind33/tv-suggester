import type { Show } from '../../api/types'
import type { AsyncStatus } from '../../hooks/useAsync'
import ShowCard from './ShowCard/ShowCard'
import ShowListSkeleton from './ShowListSkeleton/ShowListSkeleton'
import styles from './ShowList.module.css'
import StateMessage from './StateMessage/StateMessage'
import { usePresenter } from './usePresenter'

interface Props {
  shows: Show[]
  status: AsyncStatus
  error: Error | null
  onRetry: () => void
}

export default function ShowList({ shows, status, error, onRetry }: Props) {
  const { view, query, dimmed } = usePresenter(shows, status)

  if (view === 'hint') {
    return <StateMessage icon="🍿" title="Начните вводить название" text="Минимум 2 символа." />
  }
  if (view === 'skeleton') return <ShowListSkeleton />
  if (view === 'error') {
    return (
      <StateMessage
        icon="📡"
        title="Не удалось загрузить"
        text={error?.message ?? 'Что-то пошло не так.'}
        actionLabel="Повторить"
        onAction={onRetry}
      />
    )
  }
  if (view === 'empty') {
    return <StateMessage icon="🔎" title="Ничего не нашли" text={`По запросу «${query}» пусто.`} />
  }

  return (
    <ul className={`${styles.grid} ${dimmed ? styles.dimmed : ''}`}>
      {shows.map((show) => (
        <li key={show.id}>
          <ShowCard show={show} />
        </li>
      ))}
    </ul>
  )
}
