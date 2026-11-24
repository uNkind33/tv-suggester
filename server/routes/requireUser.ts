import type { Request, RequestHandler, Response } from 'express'
import { getSessionUser } from '@/tasks/getSessionUser'
import { sendError } from './sendError'

/** Токен из заголовка `Authorization: Bearer <token>`. */
export function readToken(req: Request): string | null {
  const match = /^Bearer (.+)$/.exec(req.headers.authorization ?? '')
  return match ? match[1] : null
}

/** Пускает дальше только вошедших, остальным 401. Email пользователя кладёт в `res.locals`. */
export const requireUser: RequestHandler = (req, res, next) => {
  const user = getSessionUser(readToken(req))
  if (!user) return sendError(res, 'unauthorized')

  res.locals.email = user.email
  next()
}

/** Email пользователя запроса; вызывать только за `requireUser`. */
export const emailOf = (res: Response): string => res.locals.email as string
