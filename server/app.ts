import cors from 'cors'
import express, { type ErrorRequestHandler } from 'express'
import { favoritesRouter } from '@/routes/favorites'
import { sendError } from '@/routes/sendError'
import { showsRouter } from '@/routes/shows'

// Сюда попадает только непредвиденное: ожидаемые ошибки задачи возвращают кодом.
const handleUnexpected: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error(error)
  sendError(res, 'server')
}

export const app = express()

app.use(cors({ origin: process.env.CORS_ORIGIN ?? true }))
app.use('/api/shows', showsRouter)
app.use('/api/favorites', favoritesRouter)
app.use(handleUnexpected)
