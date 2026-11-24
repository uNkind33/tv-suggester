import { useEffect, useState } from 'react'
import { showToast } from '@/tasks/showToast'
import { restoreSession } from './tasks/restoreSession'

export function usePresenter() {
  // нужно только App, поэтому не в store: пока не знаем, гость ли это, страницы не показываем
  const [isReady, setIsReady] = useState(false)

  // событие «приложение запущено», а не реакция на стор
  useEffect(() => {
    void restoreSession().then((result) => {
      if (result.error) showToast('session-restore-error')
      else if (result.favoritesError) showToast('favorites-load-error')
      setIsReady(true)
    })
  }, [])

  return { isReady }
}
