import cors from 'cors'
import express, { type ErrorRequestHandler } from 'express'
import { authRouter } from '@/routes/auth'
import { isClientError } from '@/lib/isClientError'
import { favoritesRouter } from '@/routes/favorites'
import { requireUser } from '@/routes/requireUser'
import { sendError } from '@/routes/sendError'
import { showsRouter } from '@/routes/shows'

// Сюда попадает только непредвиденное: ожидаемые ошибки задачи возвращают кодом.
// Битое тело запроса (JSON) — ошибка клиента: отвечаем 400 и в лог не пишем.
const handleUnexpected: ErrorRequestHandler = (error, _req, res, _next) => {
  if (isClientError(error)) return sendError(res, 'bad-request')
  console.error(error)
  sendError(res, 'server')
}

export const app = express()

app.use(cors({ origin: process.env.CORS_ORIGIN ?? true }))
app.use(express.json({ limit: '10kb' }))
app.use('/api/auth', authRouter)
app.use('/api/shows', showsRouter)
app.use('/api/favorites', requireUser, favoritesRouter)
app.use(handleUnexpected)
