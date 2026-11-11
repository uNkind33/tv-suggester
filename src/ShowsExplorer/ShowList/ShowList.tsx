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
    return <StateMessage icon="🍿" title="Start typing a title" text="At least 2 characters." />
  }
  if (view === 'skeleton') return <ShowListSkeleton />
  if (view === 'error') {
    return (
      <StateMessage
        icon="📡"
        title="Couldn't load shows"
        text={error?.message ?? 'Something went wrong.'}
        actionLabel="Retry"
        onAction={onRetry}
      />
    )
  }
  if (view === 'empty') {
    return <StateMessage icon="🔎" title="Nothing found" text={`No results for “${query}”.`} />
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
