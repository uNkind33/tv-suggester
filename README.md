# Simple Architecture — «Что смотрим сегодня?»

Правила для ИИ-ассистента лежат в [CLAUDE.md](CLAUDE.md).

Учебный проект: поиск сериалов через [TVMaze API](https://www.tvmaze.com/api) с фильтром по жанрам и постраничной навигацией. Главная цель — не сам экран, а строгая архитектура. Правила описаны в [ARCHITECTURE.md](ARCHITECTURE.md).

Стек: React 19, TypeScript 7, Vite 8, Zustand, CSS Modules, Oxlint; backend — Express 5 (запуск через tsx).

## Запуск

```bash
npm install
npm run dev          # backend (:3001) и Vite одновременно; Vite проксирует /api на backend
npm run dev:server   # только backend
npm run dev:client   # только Vite
npm run start:server # backend без watch
npm run build        # tsc -b && vite build
npm run lint         # oxlint
```

Переменные: `PORT` и `CORS_ORIGIN` — для backend; `VITE_API_URL` — адрес backend при сборке frontend (по умолчанию пусто: запросы идут на тот же origin через прокси).

## Проверки и деплой

На каждый Pull Request GitHub Actions (`.github/workflows/ci.yml`) запускает `npm run lint` и `npm run build` (он же проверяет типы клиента и сервера), то есть ещё до мержа.

При пуше в `main` GitHub Actions (`.github/workflows/deploy.yml`) прогоняет lint, собирает проект и публикует его на GitHub Pages: https://unkind33.github.io/tv-suggester/. Один раз нужно включить в репозитории Settings → Pages → Source: **GitHub Actions**. В CI `vite.config.ts` ставит `base: '/tv-suggester/'`, локально `base` обычный.

## Что умеет приложение

- Поиск по названию с debounce 400 мс; запрос отправляется от 2 символов.
- Очистка поля или запрос короче 2 символов сбрасывают выдачу сразу, без ожидания debounce.
- Предыдущий запрос отменяется (`AbortController`), поэтому ответы не приходят «не в том порядке».
- Фильтр по жанрам и пагинация (по 3 сериала) считаются на backend; frontend просит страницу и рисует её.
- Backend кэширует ответы TVmaze на 5 минут (`const cache = {}`): повторный запрос в этом окне не ходит во внешний API.
- Вход по одному email, без пароля: отдельная страница `#/login`, после входа вверху виден email и кнопка «Log out». Сессия хранится на backend (`const sessions = {}`), токен — в `localStorage`, поэтому перезагрузка страницы не выходит из аккаунта.
- Гость ищет и смотрит сериалы, но избранным пользоваться не может: кнопки избранного нет, клик по звёздочке просит войти.
- Избранное личное: звёздочка на карточке, кнопка со счётчиком и панель со списком; toast при добавлении и удалении. При двух и больше избранных в панели есть кнопка «Clear all»: спрашивает подтверждение в модальном окне и очищает список. Список лежит на backend по email (`favorite[email]`): вышел, вошёл под тем же email — прежний список на месте.
- Состояния списка: подсказка, скелетон, ошибка с кнопкой Retry, «Nothing found».
- Смена запроса или жанра всегда возвращает на первую страницу.

## API

| Метод | Путь | Ответ |
|---|---|---|
| GET | `/api/shows?q=&genre=&page=` | `ShowsPage`: `items`, `genres` (всей выдачи), `page`, `totalPages`, `total`. `q` — от 2 символов, иначе 400 |
| POST | `/api/auth/login` | `{ email }` → `Session`: `token`, `email` (email приводится к нижнему регистру). Неверный формат или больше 254 символов — 400 |
| GET | `/api/auth/me` | `User`: `email` владельца токена |
| POST | `/api/auth/logout` | 204; токен забывается, повтор не ошибка |
| GET | `/api/favorites` | `Favorites` текущего пользователя: `items` (последние добавленные — первыми), `count` |
| PUT | `/api/favorites/:id` | `Show`; идемпотентно, данные шоу сервер берёт у TVmaze по id |
| DELETE | `/api/favorites/:id` | 204; если шоу нет в избранном, это не ошибка |
| DELETE | `/api/favorites` | 204; очищает всё избранное пользователя |

`/api/favorites` и `/api/auth/me` требуют заголовок `Authorization: Bearer <token>`, иначе 401.

Ошибки: `{ error: 'bad-request' | 'unauthorized' | 'not-found' | 'upstream' | 'server' }` со статусом 400 / 401 / 404 / 502 / 500. Типы контракта — `shared/api.ts`.

## Структура

Алиасы: `@` = `src` (во frontend) и `server` (в backend), `@shared` = `shared`; настроены в `tsconfig.*.json` и `vite.config.ts`.

```
shared/api.ts                контракт API: Show, ShowsPage, Favorites, User, Session, ErrorCode
server/                      backend
  index.ts, app.ts           запуск, Express, CORS, обработка непредвиденного
  routes/                    роль presenter: разобрать запрос -> task -> HTTP-ответ (sendError); requireUser пускает только вошедших
  tasks/                     бизнес-логика: searchShows, getCached, createSession, getSessionUser, destroySession, избранное (addFavorite, removeFavorite, listFavorites, clearFavorites; email первым аргументом)
  storage/                   данные в памяти без правил: cache, sessions, favorite (по email)
  api/tvmaze.ts              запросы к TVmaze: fetchShows, fetchShow
  lib/                       чистые функции: genres, paginate, email
src/
  main.tsx, App.tsx          точка входа (HashRouter); App: маршруты `/` и `/login`, Toast; logic/: usePresenter, tasks/restoreSession
  api/                       запросы к нашему backend: httpClient (ApiError, коды, токен в заголовок), session (владеет токеном), auth, shows (владеет отменой), favorites
  store/                     Zustand, только данные: auth, search, shows, favorites, toast
  lib/paths.ts               адреса страниц
  tasks/                     tasks для разных веток: startSession, endSession, loadFavorites, showToast, hideToast
  LoginPage/                 страница входа; logic/: usePresenter, getLoginErrorText; tasks/: login
  components/Toast/          уведомления (общий для приложения), logic/: usePresenter, getToastText
  ShowsExplorer/             экран; дерево повторяет иерархию компонентов
    logic/                     usePresenter, useToggleFavorite (нужен звёздочке и панели)
      tasks/                     loadShows, toggleFavorite: нужны нескольким веткам экрана
    SearchBar/logic/           usePresenter, useTermDebounce; tasks/: typeQuery, searchByTerm
    Genres/ (GenreChip/)       logic/tasks/: selectGenre
    Pagination/                logic/tasks/: goToPage
    ShowList/                  logic/: usePresenter, getErrorText; ShowCard/ (FavoriteStar/), ShowListSkeleton/, StateMessage/
    UserBar/                   email и Log out (гостю — ссылка Log in); logic/tasks/: logout
    FavoritesButton/           кнопка со счётчиком (только вошедшим); FavoritesPanel/ (FavoriteRow/, ConfirmDialog/; logic/tasks/: clearFavorites)
```

У каждого компонента своя папка: `Name.tsx` (View), `Name.module.css` и `logic/` (presenter, хуки, `tasks/`), если у компонента есть логика. У `ShowListSkeleton`, `StateMessage` и `GenreChip` логики нет, поэтому `logic/` не создан.

## Как устроены слои

**View** — только JSX и вызов `usePresenter`. **Presenter** (`logic/usePresenter.ts`) читает store, готовит данные, знает, какую task вызвать, держит локальное состояние действия (`isPending`) и показывает toast по результату task. **Task** — вариант использования: обычная функция с глаголом в имени, без React, работает со store напрямую и возвращает результат `{ error }`. Сеть спрятана за `api/`. Бизнес-логика, не связанная с UI, живёт на backend, где та же схема: `routes` → `tasks` → `storage` / `api`.

Поток данных:

```
SearchBar presenter: typeQuery (task) + useTermDebounce (пауза 400 мс)
   -> searchByTerm (task): term, жанр и страница в searchStore -> loadShows (task)
   -> api/shows -> GET /api/shows
   -> server: searchShows -> getCached (TTL 5 мин) -> tvmaze -> фильтр по жанру -> страница
   -> showsStore -> ShowsExplorer/usePresenter -> View

selectGenre / goToPage (tasks) -> меняют searchStore -> сами вызывают loadShows

FavoriteStar presenter: useToggleFavorite -> toggleFavorite (task, optimistic + откат)
   -> PUT|DELETE /api/favorites/:id; по результату presenter вызывает showToast
   гость: task сразу отвечает unauthorized, presenter показывает «Log in to save favorites»

LoginPage presenter: login (task) -> POST /api/auth/login -> setToken (api/session)
   -> startSession (user в authStore + loadFavorites) -> View видит user и уходит на главную
запуск приложения: App presenter -> restoreSession (task): токен есть -> GET /api/auth/me -> startSession
UserBar presenter: logout (task) -> POST /api/auth/logout -> endSession (токен, user, избранное)
server: requireUser -> getSessionUser(token) -> email в res.locals -> tasks избранного берут favorite[email]
```

## Модули

### api/
- `request` — `fetch` + разбор ошибок: любой сбой приходит как `ApiError` с кодом (`network` или код сервера). `isAbortError` отличает отмену от ошибки.
- `fetchShowsPage` — сам отменяет предыдущий запрос (`abortFetchShowsPage` — без нового запроса, когда поле очистили). `fetchFavorites`, `putFavorite`, `deleteFavorite` — по функции на эндпоинт.

### tasks
- `loadShows()` — читает `term`, `genre`, `page` из `searchStore`, пишет статусы `idle | loading | success | error` в `showsStore`, возвращает `{ error }`. Старые данные остаются на экране, пока грузятся новые.
- `searchByTerm(term)` сбрасывает жанр и страницу и вызывает `loadShows`; `selectGenre`, `goToPage` меняют параметры и тоже вызывают `loadShows`. Реакции `useEffect` на store нет.
- `toggleFavorite(show)` — optimistic UI: стор меняется сразу, при ошибке откатывается. Список избранного хранит backend. `loadFavorites`, `typeQuery`, `showToast`, `hideToast`.
- Тексты ошибок и уведомлений делает presenter: `getErrorText`, `getToastText`.

### server/
- `getCached(key, load)` — кэш в обычном объекте (`storage/cache.ts`), TTL 5 минут проверяет task; в консоль пишет `hit` / `miss`.
- `searchShows` — TVmaze → жанры всей выдачи → фильтр → страница (номер ограничивается допустимым диапазоном). Возвращает `{ error } | { data }`, про HTTP не знает; код ошибки в статус превращает `routes/sendError`.
- Избранное хранит полные данные шоу, поэтому панель не делает лишних запросов.

## Линтинг

Используется [Oxlint](https://oxc.rs/docs/guide/usage/linter) (`.oxlintrc.json`). Правила:

- `max-lines` = 120 — механическая проверка правила 2 из ARCHITECTURE.md;
- `react/rules-of-hooks`, `react/exhaustive-deps`, `react/only-export-components`;
- `eqeqeq`, `no-unused-vars`.

Почему не ESLint: typescript-eslint пока не поддерживает TypeScript 7 (нет JS API компилятора; peer-зависимость `typescript <6.1.0`). Когда поддержка появится, переход возможен без изменения кода проекта. Типы проверяет `tsc` (`npm run build`).

## Ограничения

- Кэш, сессии и избранное живут в памяти сервера: перезапуск стирает их (все выходят из аккаунта и теряют избранное), БД нет.
- Вход без пароля: любой, кто знает чужой email, войдёт под ним. Для учебного проекта это условие задания, для настоящего нужна проверка владения почтой.
- Кэш не вытесняет устаревшие записи и не склеивает одновременные одинаковые запросы: для долгоживущего сервера это утечка памяти, для учебного проекта допустимо.
- Запрос к TVmaze ограничен таймаутом 10 секунд; по таймауту клиент получает `upstream`. Сам запрос клиента к нашему backend обрывается через 15 секунд (`network`).
- Тестов нет.
- Запрос к TVmaze, который упал сетевой ошибкой, не повторяется автоматически: клиент получает 502 и кнопку Retry; причина пишется в лог сервера.
