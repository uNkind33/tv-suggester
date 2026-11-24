import type { Show } from '@shared/api'
import type { ApiErrorCode } from '@/lib/apiErrorCode'
import type { AsyncStatus } from '@/store/showsStore'
import ShowCard from './ShowCard/ShowCard'
import ShowListSkeleton from './ShowListSkeleton/ShowListSkeleton'
import styles from './ShowList.module.css'
import StateMessage from './StateMessage/StateMessage'
import { usePresenter } from './logic/usePresenter'

interface Props {
  shows: Show[]
  status: AsyncStatus
  error: ApiErrorCode | null
  onRetry: () => void
}

export default function ShowList({ shows, status, error, onRetry }: Props) {
  const { view, dimmed, hintText, emptyText, errorText } = usePresenter(shows, status, error)

  if (view === 'hint') {
    return <StateMessage icon="🍿" title="Start typing a title" text={hintText} />
  }
  if (view === 'skeleton') return <ShowListSkeleton />
  if (view === 'error') {
    return (
      <StateMessage
        icon="📡"
        title="Couldn't load shows"
        text={errorText}
        actionLabel="Retry"
        onAction={onRetry}
      />
    )
  }
  if (view === 'empty') {
    return <StateMessage icon="🔎" title="Nothing found" text={emptyText} />
  }

  return (
    <ul className={styles.grid} data-dimmed={dimmed}>
      {shows.map((show) => (
        <li key={show.id}>
          <ShowCard show={show} />
        </li>
      ))}
    </ul>
  )
}
