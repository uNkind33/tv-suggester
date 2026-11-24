import { type Request, type Response, Router } from 'express'
import { addFavorite } from '@/tasks/addFavorite'
import { clearFavorites } from '@/tasks/clearFavorites'
import { listFavorites } from '@/tasks/listFavorites'
import { removeFavorite } from '@/tasks/removeFavorite'
import { emailOf } from './requireUser'
import { sendError } from './sendError'

/** Избранное текущего пользователя (за `requireUser`): GET и DELETE /api/favorites, PUT и DELETE /api/favorites/:id. */
export const favoritesRouter = Router()

favoritesRouter.get('/', (_req, res) => {
  res.json(listFavorites(emailOf(res)))
})

favoritesRouter.delete('/', (_req, res) => {
  clearFavorites(emailOf(res))
  res.status(204).end()
})

favoritesRouter.put('/:id', async (req, res) => {
  const id = parseId(req, res)
  if (id === null) return

  const result = await addFavorite(emailOf(res), id)
  if (result.error) return sendError(res, result.error)
  res.json(result.show)
})

favoritesRouter.delete('/:id', (req, res) => {
  const id = parseId(req, res)
  if (id === null) return

  removeFavorite(emailOf(res), id)
  res.status(204).end()
})

/** id шоу — целое положительное число, иначе отвечаем 400. */
function parseId(req: Request, res: Response): number | null {
  const id = Number(req.params.id)
  if (Number.isInteger(id) && id > 0) return id

  sendError(res, 'bad-request')
  return null
}
