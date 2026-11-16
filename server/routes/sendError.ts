import type { ErrorCode } from '@shared/api'
import type { Response } from 'express'

const ERROR_STATUS: Record<ErrorCode, number> = {
  'bad-request': 400,
  'not-found': 404,
  upstream: 502,
  server: 500,
}

/** Код ошибки задачи -> HTTP-статус. Тело ответа — сам код: `{ error }`. */
export function sendError(res: Response, code: ErrorCode): void {
  res.status(ERROR_STATUS[code]).json({ error: code })
}
