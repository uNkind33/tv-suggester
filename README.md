# Simple Architecture — «Что смотрим сегодня?»

Правила для ИИ-ассистента лежат в [CLAUDE.md](CLAUDE.md).

Учебный проект: поиск сериалов через [TVMaze API](https://www.tvmaze.com/api) с фильтром по жанрам и постраничной навигацией. Главная цель — не сам экран, а строгая архитектура. Правила описаны в [ARCHITECTURE.md](ARCHITECTURE.md).

Стек: React 19, TypeScript 7, Vite 8, Zustand, CSS Modules, Oxlint.

## Запуск

```bash
npm install
npm run dev       # dev-сервер Vite
npm run build     # tsc -b && vite build
npm run preview   # предпросмотр сборки
npm run lint      # oxlint
```

## Деплой

При пуше в `main` GitHub Actions (`.github/workflows/deploy.yml`) прогоняет lint, собирает проект и публикует его на GitHub Pages: https://unkind33.github.io/tv-suggester/. Один раз нужно включить в репозитории Settings → Pages → Source: **GitHub Actions**. В CI `vite.config.ts` ставит `base: '/tv-suggester/'`, локально `base` обычный.

## Что умеет приложение

- Поиск по названию с debounce 400 мс; запрос отправляется от 2 символов.
- Очистка поля или запрос короче 2 символов сбрасывают выдачу сразу, без ожидания debounce.
- Предыдущий запрос отменяется (`AbortController`), поэтому ответы не приходят «не в том порядке».
- Кэш ответов в памяти: повторный запрос с тем же текстом не ходит в сеть.
- Фильтр по жанрам: список жанров строится из найденных сериалов, повторный клик снимает фильтр.
- Пагинация по 3 сериала на страницу.
- Состояния списка: подсказка, скелетон, ошибка с кнопкой Retry, «Nothing found».
- Весь интерфейс на английском; искать можно на любом языке (запрос уходит в API как есть).
- Смена запроса или жанра всегда возвращает на первую страницу.

## Структура

```
src/
  main.tsx, App.tsx          точка входа
  index.css                  глобальные стили
  api/                       работа с сетью
    httpClient.ts              getJson, HttpError, isAbortError
    tvmaze.ts                  searchShows(query, signal)
    types.ts                   Show, SearchResult
  store/
    searchStore.ts           Zustand: query, genre, page и сеттеры
  hooks/                     переиспользуемые хуки без привязки к экрану
    useAsync.ts                загрузка: отмена, гонки, кэш, retry
    useDebouncedValue.ts       debounce значения
  lib/                       чистые функции
    genres.ts                  extractGenres, filterByGenre
    paginate.ts                paginate, pageCount, PAGE_SIZE
    queryCache.ts              in-memory кэш (Map)
  ShowsExplorer/             экран; дерево повторяет иерархию компонентов
    ShowsExplorer.tsx          View
    usePresenter.ts            Presenter: жанры, текущая страница, статус
    useShows.ts                debounce -> useAsync -> { shows, status, error, retry }
    SearchBar/                 поле поиска
    Genres/                    список жанров
      GenreChip/                 одна кнопка-жанр (+ usePresenter)
    ShowList/                  сетка карточек и состояния
      ShowCard/                  карточка сериала (+ usePresenter)
      ShowListSkeleton/          скелетон загрузки
      StateMessage/              сообщение (подсказка, ошибка, пусто)
    Pagination/                переключение страниц
```

У каждого компонента своя папка: `Name.tsx` (View), `Name.module.css` и `usePresenter.ts`, если есть что готовить (у `ShowListSkeleton` и `StateMessage` логики нет, поэтому presenter не создан).

## Как устроены слои

**View** — только JSX и вызов `usePresenter`. **Presenter** (`usePresenter.ts`) берёт данные из хранилища и готовит их для View. Логика загрузки и преобразований вынесена в хуки (`hooks/`, `useShows`) и чистые функции (`lib/`). Сеть спрятана за `api/`.

Поток данных:

```
SearchBar -> searchStore (query)
   -> useShows: debounce -> useAsync(key, fetcher) -> api/tvmaze
   -> ShowsExplorer/usePresenter: genres, filterByGenre, paginate
   -> View: SearchBar / Genres / ShowList / Pagination
```

## Модули

### api/
- `getJson<T>(url, signal?)` — `fetch` + проверка `response.ok`, при ошибке бросает `HttpError(status)`.
- `isAbortError(error)` — отличает отмену запроса от настоящей ошибки.
- `searchShows(query, signal?)` — `GET /search/shows?q=`, возвращает `Show[]`.

### store/searchStore.ts
Состояние поиска: `query`, `genre`, `page`. `setQuery` сбрасывает жанр и страницу, `setGenre` сбрасывает страницу.

### hooks/
- `useAsync(key, fetcher)` — самописный аналог `useQuery`. `key === null` — запроса нет (`idle`). Возвращает `{ status, data, error, retry }`, где `status` — `idle | loading | success | error`. `retry` всегда идёт в сеть (запись в кэше сбрасывается). Старые данные остаются на экране, пока грузятся новые. Запрос отменяется при смене ключа и размонтировании. `fetcher` намеренно не входит в зависимости эффекта: запрос определяется ключом.
- `useDebouncedValue(value, delayMs)` — значение, которое обновляется после паузы.

### lib/
- `extractGenres(shows)` — уникальные жанры по алфавиту.
- `filterByGenre(shows, genre)` — фильтр, `null` — без фильтра.
- `paginate(items, page, size)` и `pageCount(total, size)` — страница 1-based, минимум одна страница.
- `getCached` / `setCached` — in-memory кэш ответов.

### ShowsExplorer/
- `useShows` — экспортирует `DEBOUNCE_MS` (400) и `MIN_QUERY_LENGTH` (2). Ключ кэша — запрос в нижнем регистре.
- `ShowList/usePresenter` — из статуса и списка выбирает вид: `hint | skeleton | error | empty | list`; во время загрузки список затемняется.

## Линтинг

Используется [Oxlint](https://oxc.rs/docs/guide/usage/linter) (`.oxlintrc.json`). Правила:

- `max-lines` = 120 — механическая проверка правила 2 из ARCHITECTURE.md;
- `react/rules-of-hooks`, `react/exhaustive-deps`, `react/only-export-components`;
- `eqeqeq`, `no-unused-vars`.

Почему не ESLint: typescript-eslint пока не поддерживает TypeScript 7 (нет JS API компилятора; peer-зависимость `typescript <6.1.0`). Когда поддержка появится, переход возможен без изменения кода проекта. Типы проверяет `tsc` (`npm run build`).

## Ограничения

- Кэш живёт только в памяти и не имеет TTL.
- Тестов нет.
- Пагинация клиентская: API отдаёт все найденные сериалы одним ответом.
