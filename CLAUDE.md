# AI Rules — Simple Architecture (React + TypeScript)

Ты пишешь код в проекте по правилам Simple Architecture. **Simple Architecture = Clean Architecture + VIPER**: ответственность разделена по слоям, а View === JSX + `usePresenter()`. Полный список правил — [ARCHITECTURE.md](ARCHITECTURE.md), описание проекта — [README.md](README.md). Ниже — то, как их применять. Если задача требует нарушить правило, не нарушай его молча: остановись и скажи об этом.

## 1. Слои

| Слой | Файл | Что делает | Чего НЕ делает |
|---|---|---|---|
| View | `Name.tsx` | Только JSX. Получает props, вызывает `usePresenter`, раскладывает результат по разметке | Не форматирует, не считает, не фильтрует, не обращается к store и API, не склеивает классы |
| Presenter | `logic/usePresenter.ts` | Читает store, готовит данные для View (форматирование, флаги, тексты), знает, какую task вызвать на какое событие, держит локальное состояние действия (`isPending`), показывает toast по результату task | Не содержит JSX, не ходит в сеть, не содержит бизнес-правил |
| Task | `logic/tasks/verbNoun.ts` | Бизнес-логика: один вариант использования = одна обычная функция; возвращает результат | Не импортирует React, не знает про компоненты, не готовит текст для пользователя |
| Хуки | `logic/useX.ts` (общие для приложения — `src/hooks/`, когда понадобятся) | React-клейка для presenter: debounce, подписки, `useEffect` | Не содержат бизнес-правил |
| Инфраструктура | `api/`, `store/`, `lib/` | Сеть (и отмена запросов), состояние (store — только данные), чистые утилиты | Не знает про React-компоненты; store не содержит логики |

**Task (вариант использования).** Бизнес существует внутри и вне приложения, поэтому его логика не привязана к React. Task — plain function, имя — глагол + объект (`toggleFavorite`, `selectGenre`, `loadShows`; не `useFavorite`, не `favoriteHandler`). Из лекции: task — функция-глагол, без React, со store напрямую, возвращает результат presenter'у, `loading`/`error` действия живут в presenter. Остальное ниже — договорённости проекта (ARCHITECTURE.md, п. 17–21); если курс скажет иначе, меняем их.

Правила:

- Обращается к store напрямую (`useXStore.getState()` / `setState`), к сети — только через функции `api/`.
- **Возвращает результат** вызывающему: `{ error: null, ... } | { error: code }`. Исключения из `api/` ловит сама и превращает в код ошибки. Отмену запроса (`isAbortError`) за ошибку не считает.
- Presenter дожидается результата и решает, что показать: toast, текст ошибки, состояние кнопки. Текст для пользователя делает presenter, а не task и не store.
- Состояние одного действия (идёт запрос, ошибка) нужно только его компоненту — держи в presenter (`useState`), в store кладём только то, что читают несколько компонентов (выдача, избранное).
- **Сменил параметр — вызови загрузку.** Task, меняющая параметры запроса, сама вызывает `loadShows()` (`selectGenre` ставит жанр и вызывает загрузку). В проекте принято не запускать сценарии `useEffect`-ом по изменению store.
- Мгновенная реакция (optimistic UI) и откат при ошибке — тоже внутри task (`toggleFavorite`).
- Зависимые действия (новый запрос сбрасывает жанр и страницу) — это task, а не метод store.
- Task — функция без скрытого состояния между вызовами. Владелец отмены запроса — `api/`, а не task; debounce (таймер) — хук presenter.

Допустимо в View: условный рендер и ранний `return null` по готовому флагу, `map` по готовому массиву, передача props. Любое `?.slice`, `join`, `toFixed`, шаблонная строка с данными, тернарник для className или иконки — это логика, её место в presenter. Для состояния в CSS используй атрибуты (`aria-pressed`), а не классы из presenter.

## 2. Файлы и папки

- Файл — не больше 120 строк (проверяет oxlint `max-lines`). Не помещается — раздели, а не сжимай.
- Один компонент — одна папка: `Name/Name.tsx`, `Name/Name.module.css` и папка `Name/logic/`, если у компонента есть логика.
- **Вся JS-логика компонента — в `Name/logic/`:** `usePresenter.ts`, остальные хуки (`useTermDebounce.ts`), вспомогательные функции presenter (`getErrorText.ts`) и папка `tasks/` с задачами компонента. Нет логики — нет и папки `logic/`.
- Дерево папок повторяет иерархию компонентов: дочерний компонент лежит в папке родителя. Вложенность не ограничена.
- Где лежит компонент — спроси себя, кто его импортирует:
  1. **Только один родитель** → подпапка в папке этого родителя, с той же структурой (`Parent/Child/Child.tsx`, `Child.module.css`, `logic/`). Папку `components/` для него не создаём. Пример: `ShowList/ShowCard/`, `FavoritesPanel/FavoriteRow/`.
  2. **Несколько мест в одной ветке дерева** → папка `components/` в ближайшем общем предке этих мест (`Branch/components/Shared/`).
  3. **Разные ветки / всё приложение** → `src/components/Shared/` (пример: `src/components/Toast/`).
  - Компонент поднимается вверх только тогда, когда у него появился второй потребитель, и ровно на тот уровень, где находятся оба. Заранее «на вырост» в `components/` ничего не кладём.
- **Tasks и хуки раскладываются по тем же правилам, что компоненты:** нужна одному компоненту — `Component/logic/tasks/`; нескольким в одной ветке — `logic/tasks/` ближайшего общего предка (`ShowsExplorer/logic/tasks/loadShows.ts`, `ShowsExplorer/logic/useToggleFavorite.ts`); разным веткам — глобальная `src/tasks/` (`showToast`).
- `logic/usePresenter.ts` — только если есть что готовить. Пустой presenter не создавай. Увидел логику в View — вынеси её в presenter.
- Инфраструктура в корне `src`: `api/`, `store/`, `lib/`, `hooks/`, `tasks/`, `components/` (папку создаём, когда в ней есть что положить).
- Стили — CSS Modules рядом с компонентом (`Name.module.css`).
- Импорты: `@/` (= `src/`) для `api`, `store`, `lib`, `hooks`, `tasks`, `components` и всего, что выше по дереву; `./` — только для своего компонента и его детей (`./logic/usePresenter`). `../` не пишем.

## 3. Именование

- Компонент и его файл: `PascalCase`, `export default`. Props — `interface Props` в том же файле.
- Presenter: `export function usePresenter(...)` в `logic/usePresenter.ts`, принимает только то, что нельзя взять из store (props родителя).
- Task: глагол в имени функции и файла (`searchByTerm.ts`). Функция `api/` называется по транспортному действию (`fetchShowsPage`, `putFavorite`), task — по сценарию (`searchByTerm`, `toggleFavorite`): имена не сталкиваются.
- Хуки логики: `useXxx`, имя по смыслу (`useTermDebounce`, `useToggleFavorite`), а не по технике.
- Константы: `UPPER_SNAKE_CASE` и экспортируются там, где определены (`DEBOUNCE_MS`).
- Общие типы объявляй один раз и импортируй (`import type`). Не дублируй union-типы по файлам.

## 4. Данные и асинхронность

- Запросы к API — только через функции в `api/`; их вызывают tasks. Компоненты и presenter их не вызывают.
- Загрузку делает task (`loadShows`): статусы `idle | loading | success | error` пишет в store, возвращает `{ error }`. Отмена прошлого запроса (`AbortController`) и защита от гонок — в `api/` (`fetchShowsPage` сам отменяет предыдущий). Не пиши `fetch` в `useEffect` компонента.
- **Frontend и backend.** Frontend отвечает за UI, debounce и состояние экрана. Бизнес-логика (TVmaze, кэш, фильтр по жанрам, пагинация, избранное) живёт на backend (`server/`). Клиент не фильтрует и не пагинирует и не знает про TVmaze: он просит нужную страницу и рисует то, что пришло.
- **Backend** повторяет слои клиента без View: `server/routes/` — роль presenter (разобрать запрос, вызвать task, превратить результат в HTTP-ответ), `server/tasks/` — бизнес-логика без Express и без HTTP-статусов, `server/storage/` — данные в памяти (`const cache = {}`, `const favorite = {}`) и простые методы чтения и записи без правил, `server/api/` — запросы к TVmaze, `server/lib/` — чистые функции. Те же правила: ≤120 строк, имена tasks — глаголы, task возвращает результат. TTL кэша проверяет task `getCached`, а не storage.
- Ошибки между сервером и клиентом ходят кодами: `{ error: 'not-found' | 'upstream' | ... }` + HTTP-статус. Текст для пользователя делает клиент (presenter).
- Типы и константы контракта API (`Show`, `ShowsPage`, `ErrorCode`, `MIN_QUERY_LENGTH`) лежат в `shared/` и импортируются как `@shared/...`; на клиенте и сервере их не дублируем. В `server/` алиас `@/` = `server/`.
- Поиск «по набору текста» — debounce в presenter (хук `useTermDebounce` вызывает task `searchByTerm`) и минимальная длина запроса.
- Любой экран с данными обрабатывает все состояния: `idle`, `loading`, `error` (с повтором), пустой результат, успех.
- Глобальное состояние — Zustand-store, в котором только данные и никаких действий. Уведомление в store — данные (`kind`, `showName`), а не текст.

## 5. Чек-лист перед тем как сказать «готово»

1. В View нет логики (см. раздел 1), в presenter нет бизнес-правил, в store нет действий, в task нет React и текстов для пользователя.
2. У каждого presenter есть причина существовать; пустых нет.
3. Ни один файл не длиннее 120 строк (и в `server/` тоже).
4. Бизнес-логика — в tasks (глагол в имени, возвращают результат, без React), а на backend, если она не про UI. Параметр запроса сменился — task сама вызывает загрузку, без `useEffect` по store.
5. Новый компонент, task или хук лежит в `logic/` / папке на правильном уровне дерева.
6. Типы не продублированы.
7. `npm run lint` и `npm run build` проходят без ошибок.
8. Новое правило, возникшее на практике, добавлено в «Добавлено на практике» в ARCHITECTURE.md.

## 6. Пример (образец в проекте)

`src/ShowsExplorer/Genres/`:

```tsx
// Genres.tsx — только разметка
export default function Genres({ genres }: Props) {
  const { activeGenre, selectGenre, resetGenre } = usePresenter()
  return (/* JSX */)
}

// logic/usePresenter.ts — читает store, решает, какую task вызвать
export function usePresenter() {
  const genre = useSearchStore((state) => state.genre)
  return {
    activeGenre: genre,
    selectGenre: (value: string) => selectGenre(value === genre ? null : value),
    resetGenre: () => selectGenre(null),
  }
}

// logic/tasks/selectGenre.ts — вариант использования: меняет store и сам вызывает загрузку
export async function selectGenre(genre: string | null): Promise<LoadShowsResult> {
  if (genre === useSearchStore.getState().genre) return { error: null }
  useSearchStore.setState({ genre, page: 1 })
  return loadShows()
}
```
