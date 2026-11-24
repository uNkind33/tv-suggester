import { Router } from 'express'
import { createSession } from '@/tasks/createSession'
import { destroySession } from '@/tasks/destroySession'
import { emailOf, readToken, requireUser } from './requireUser'
import { sendError } from './sendError'

/** POST /api/auth/login { email }, GET /api/auth/me, POST /api/auth/logout. */
export const authRouter = Router()

authRouter.post('/login', (req, res) => {
  const email: unknown = req.body?.email

  const result = createSession(typeof email === 'string' ? email : '')
  if (result.error) return sendError(res, result.error)
  res.json(result.session)
})

authRouter.get('/me', requireUser, (_req, res) => {
  res.json({ email: emailOf(res) })
})

authRouter.post('/logout', (req, res) => {
  const token = readToken(req)
  if (token) destroySession(token)
  res.status(204).end()
})
