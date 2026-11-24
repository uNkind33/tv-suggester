import { Route, Routes } from 'react-router'
import Toast from '@/components/Toast/Toast'
import { HOME_PATH, LOGIN_PATH } from '@/lib/paths'
import LoginPage from './LoginPage/LoginPage'
import ShowsExplorer from './ShowsExplorer/ShowsExplorer'
import { usePresenter } from './logic/usePresenter'

export default function App() {
  const { isReady } = usePresenter()

  return (
    <>
      {isReady && (
        <Routes>
          <Route path={HOME_PATH} element={<ShowsExplorer />} />
          <Route path={LOGIN_PATH} element={<LoginPage />} />
        </Routes>
      )}
      <Toast />
    </>
  )
}
