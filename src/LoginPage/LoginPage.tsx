import { Link, Navigate } from 'react-router'
import styles from './LoginPage.module.css'
import { usePresenter } from './logic/usePresenter'

export default function LoginPage() {
  const { isLoggedIn, homePath, email, maxLength, onEmailChange, onSubmit, isPending, hasError, errorText, submitLabel } =
    usePresenter()

  if (isLoggedIn) return <Navigate to={homePath} replace />

  return (
    <main className={styles.root}>
      <form className={styles.form} onSubmit={onSubmit}>
        <h1 className={styles.title}>Log in</h1>
        <p className={styles.hint}>Enter your email to keep your own favorites. No password needed.</p>
        <label className={styles.label} htmlFor="login-email">
          Email
        </label>
        <input
          id="login-email"
          className={styles.input}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          maxLength={maxLength}
          autoFocus
          value={email}
          onChange={onEmailChange}
          aria-invalid={hasError}
          aria-describedby="login-error"
        />
        <p id="login-error" className={styles.error} role="alert">
          {errorText}
        </p>
        <button className={styles.submit} type="submit" disabled={isPending}>
          {submitLabel}
        </button>
        <Link className={styles.back} to={homePath}>
          ← Back to shows
        </Link>
      </form>
    </main>
  )
}
