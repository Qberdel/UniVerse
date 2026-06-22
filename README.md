## UniVerse V4

Веб-приложение для системы активности университетов: рейтинг ВУЗов, карточки университетов, сравнение, профиль пользователя, модерация, формы авторизации и подключение к backend API (регистрация, вход, профиль).

## Технологический стек

- `React 18` + `TypeScript`
- `Vite` для сборки и dev-сервера
- `react-router` для маршрутизации
- `Tailwind CSS` + набор UI-компонентов (`src/app/components/ui`)
- `lucide-react` для иконок
- Локальное состояние через React hooks, `localStorage` и cookie (JWT)
- Backend API через `fetch` (`src/app/lib/api.ts`, базовый URL из `.env`)

## Масштаб разработки

UniVerse V4 — полноценное одностраничное веб-приложение (SPA) среднего масштаба для университетской платформы с системой активности (АК).

### Объём кодовой базы (frontend)

| Показатель | Значение |
|---|---|
| TypeScript / TSX файлов | ~85 |
| Строк кода (src/) | ~10 700 |
| Страниц (роутов) | 15 |
| UI-компонентов (библиотека) | ~45 |
| Бизнес-модулей (`lib/`) | 8 |
| Кастомных компонентов | ~10 |

### Функциональный охват

**Реализовано и подключено к backend API (`swagger.json`):**

- Аутентификация: регистрация, вход, JWT в cookie
- Профиль пользователя: базовые данные, полный профиль, история активностей
- Редактирование профиля: email, загрузка аватара (`PATCH /api/user/avatar`)
- Рейтинг университетов с пагинацией (`GET /api/rating`)
- Детальная страница вуза со статистикой и динамикой (`GET /api/university/:id`)
- Магазин товаров за АК (`GET /api/store`)
- Модерация заявок администратором (`GET /api/admin`, `PATCH /api/admin/activities/:id`)

**Клиентская логика (без отдельного backend-эндпоинта):**

- Корзина и списание АК при покупке
- Онбординг новых пользователей
- Сравнение вузов (демо-данные)
- Дополнение заявок студентом (localStorage)

### Архитектура

```text
Браузер (React SPA)
    │
    ├── UI-слой (pages + components)
    ├── Слой данных (lib/api.ts — HTTP-клиент)
    ├── Локальное состояние (React hooks)
    └── Персистентность (localStorage + cookie)
            │
            ▼
    Backend API (Go, localhost:8080)
    PostgreSQL / файловое хранилище
```

### Интеграция с API

HTTP-клиент в `src/app/lib/api.ts` покрывает **14 эндпоинтов** из swagger-спецификации: auth, user, profile, rating, university, store, admin, upload. Все запросы идут на `{VITE_API_BASE_URL}/api/...` с Bearer-токеном для защищённых маршрутов.

### Стадия проекта

| Компонент | Статус |
|---|---|
| UI / UX всех основных экранов | Готово |
| Интеграция с backend API | Основные сценарии готовы |
| Магазин и корзина | Клиентская логика, без backend-оплаты |
| Добавление заявки | Форма готова, отправка на API — в планах |
| Модерация | Чтение и смена статуса через API |
| Тесты (unit / e2e) | Не реализованы |
| CI/CD | Не настроен |

## Быстрый старт

```bash
cp .env.example .env
# Укажите VITE_API_BASE_URL в .env
npm install
npm run dev
```

Сборка production:

```bash
npm run build
```

## Структура проекта

```text
src/
  main.tsx                    # Точка входа
  app/
    App.tsx                   # Подключение RouterProvider
    routes.tsx                # Маршруты приложения
    layouts/
      RootLayout.tsx          # Общий лейаут (header/nav/footer + Outlet)
    pages/                    # Страницы (роут-компоненты)
    components/
      ui/                     # Библиотека базовых UI-компонентов
      AuthPageShell.tsx       # Общий шаблон для auth-страниц
      UniversityCard.tsx
      ActivityChart.tsx
      StatsCard.tsx
    lib/
      auth.ts                 # JWT cookie, флаг регистрации
      api.ts                  # HTTP-клиент backend API
      profile.ts              # Профиль пользователя в localStorage
      claims.ts               # История заявок (localStorage, демо)
  styles/
    index.css
    theme.css
    tailwind.css
```

## Как работает приложение

### 1) Точка входа и инициализация

- `src/main.tsx` монтирует `<App />` в `#root`.
- `src/app/App.tsx` рендерит `<RouterProvider router={router} />`.

### 2) Роутинг

Все маршруты описаны в `src/app/routes.tsx` через `createBrowserRouter`.

Основные маршруты:

- `/` - о проекте (`AboutPage`)
- `/dashboard` - рейтинг и аналитика ВУЗов
- `/register` - регистрация (API `POST /register`)
- `/login` - вход (API `POST /login`, JWT в cookie)
- `/forgot-password` - восстановление пароля (демо)
- `/profile` - профиль (защищён проверкой регистрации)
- `/add-activity` - добавление заявки (доступ только для зарегистрированных)
- `/university/:id` - страница конкретного ВУЗа
- `/compare` - сравнение ВУЗов (демо)
- `/cart`, `/menu`, `/moderator` - дополнительные экраны

Защита маршрутов:

- `/profile` — `loader`: если `isRegistered()` возвращает `false`, редирект на `/register`.
- `/add-activity` — в `AddActivityPage`: если пользователь не зарегистрирован, показывается экран «Доступ ограничен» с предложением зарегистрироваться или войти.

### 3) Хранение пользовательских данных

- **JWT** — cookie `universe_token` (`auth.ts`)
- **Флаг сессии** — `localStorage` ключ `universe:isRegistered`
- **Профиль** — `localStorage` ключ `universe:profile` (`profile.ts`)
- **Заявки (демо)** — `localStorage` ключ `universe:studentClaims` (`claims.ts`)

Подробнее о валидации и API — в `VALIDATION_AND_BACKEND.txt` и `FUNCTIONALITY.md`.

## Где и как написаны страницы

Все страницы лежат в `src/app/pages`.

- `AboutPage.tsx`: лендинг «О проекте», CTA для входа/регистрации.
- `DashboardPage.tsx`: рейтинг ВУЗов, фильтры, аналитика и графики.
- `UniversityPage.tsx`: детальная страница университета (статы, история, топ студентов, инфо).
- `CompareUniversitiesPage.tsx`: демо-сравнение двух ВУЗов.
- `RegistrationPage.tsx`, `LoginPage.tsx`, `ForgotPasswordPage.tsx`: auth-сценарии с backend API.
- `ProfilePage.tsx`: личный профиль, история заявок, редактирование email и аватара через API.
- `AddActivityPage.tsx`: форма добавления активности; для неавторизованных — экран ошибки доступа.
- `ModeratorPage.tsx`: экран модерации (демо-функциональность).
- `MenuPage.tsx`, `CartPage.tsx`: каталог товаров из API, корзина, списание АК.

## Что уже оптимизировано

В текущей итерации выполнены безопасные рефакторинги:

- Вынесен общий UI-каркас auth-страниц в `AuthPageShell`, что убрало дублирование в `LoginPage`, `RegistrationPage`, `ForgotPasswordPage`.
- В `DashboardPage`:
  - вынесены статические демо-данные за пределы компонента (меньше лишних пересозданий объектов на ререндере);
  - добавлена `useMemo`-фильтрация по поиску и категории;
  - убран неиспользуемый элемент фильтра.
- В `RootLayout` вынесен массив навигации в константу вне компонента.
- На `/add-activity` добавлена проверка регистрации с UI в стиле сайта.
