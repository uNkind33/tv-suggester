import { Router } from 'express'
import { searchShows } from '@/tasks/searchShows'
import { sendError } from './sendError'

/** GET /api/shows?q=&genre=&page= — разбирает параметры и отдаёт результат задачи. */
export const showsRouter = Router()

showsRouter.get('/', async (req, res) => {
  const { q, genre, page } = req.query

  const result = await searchShows({
    query: typeof q === 'string' ? q : '',
    genre: typeof genre === 'string' && genre ? genre : null,
    page: Number.parseInt(String(page ?? '1'), 10) || 1,
  })

  if (result.error) return sendError(res, result.error)
  res.json(result.data)
})
