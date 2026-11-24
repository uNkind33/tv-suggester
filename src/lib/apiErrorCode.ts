import type { ErrorCode } from '@shared/api'

/** Что пошло не так при обращении к серверу: код сервера или `network`. Лежит в `lib/`, чтобы store и api зависели от него, а не друг от друга. Текст делает Presenter. */
export type ApiErrorCode = ErrorCode | 'network'
