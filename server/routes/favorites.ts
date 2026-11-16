import { type Request, type Response, Router } from 'express'
import { addFavorite } from '@/tasks/addFavorite'
import { listFavorites } from '@/tasks/listFavorites'
import { removeFavorite } from '@/tasks/removeFavorite'
import { sendError } from './sendError'

/** GET /api/favorites, PUT и DELETE /api/favorites/:id. */
export const favoritesRouter = Router()

favoritesRouter.get('/', (_req, res) => {
  res.json(listFavorites())
})

favoritesRouter.put('/:id', async (req, res) => {
  const id = parseId(req, res)
  if (id === null) return

  const result = await addFavorite(id)
  if (result.error) return sendError(res, result.error)
  res.json(result.show)
})

favoritesRouter.delete('/:id', (req, res) => {
  const id = parseId(req, res)
  if (id === null) return

  removeFavorite(id)
  res.status(204).end()
})

/** id шоу — целое положительное число, иначе отвечаем 400. */
function parseId(req: Request, res: Response): number | null {
  const id = Number(req.params.id)
  if (Number.isInteger(id) && id > 0) return id

  sendError(res, 'bad-request')
  return null
}
