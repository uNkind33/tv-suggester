import { Link } from 'react-router'
import styles from './UserBar.module.css'
import { usePresenter } from './logic/usePresenter'

export default function UserBar() {
  const { isLoggedIn, email, loginPath, logoutLabel, isPending, onLogout } = usePresenter()

  if (!isLoggedIn) {
    return (
      <Link className={styles.btn} to={loginPath}>
        Log in
      </Link>
    )
  }

  return (
    <div className={styles.root}>
      <span className={styles.email}>{email}</span>
      <button className={styles.btn} onClick={onLogout} disabled={isPending}>
        {logoutLabel}
      </button>
    </div>
  )
}
