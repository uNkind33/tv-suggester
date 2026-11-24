import type { ErrorCode, Show } from '@shared/api'
import { fetchShow } from '@/api/tvmaze'
import { findFavorite, saveFavorite } from '@/storage/favorite'
import { getCached } from './getCached'
import { toErrorCode } from './toErrorCode'

export type AddFavoriteResult = { error: null; show: Show } | { error: ErrorCode }

/** Добавить шоу в избранное пользователя. Данные шоу сервер берёт у TVmaze сам (через кэш): клиенту достаточно прислать id. Повтор ничего не меняет. */
export async function addFavorite(email: string, id: number): Promise<AddFavoriteResult> {
  const existing = findFavorite(email, id)
  if (existing) return { error: null, show: existing.show }

  try {
    const show = await getCached(`show:${id}`, () => fetchShow(id))
    saveFavorite(email, show, Date.now())
    return { error: null, show }
  } catch (error) {
    return { error: toErrorCode(error) }
  }
}
