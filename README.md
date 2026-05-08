## UniVerse V4

Веб-приложение (демо) для системы активности университетов: рейтинг ВУЗов, карточки университетов, сравнение, профиль пользователя, модерация и формы авторизации.

## Технологический стек

- `React 18` + `TypeScript`
- `Vite` для сборки и dev-сервера
- `react-router` для маршрутизации
- `Tailwind CSS` + набор UI-компонентов (`src/app/components/ui`)
- `lucide-react` для иконок
- Локальное состояние через React hooks и `localStorage` (без backend API в текущей версии)

## Быстрый старт

```bash
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
      auth.ts                 # Флаги авторизации в localStorage
      profile.ts              # Профиль пользователя в localStorage
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

- `/` - главная (рейтинг + аналитика)
- `/register` - регистрация
- `/login` - вход
- `/forgot-password` - восстановление пароля
- `/profile` - профиль (защищён проверкой регистрации)
- `/university/:id` - страница конкретного ВУЗа
- `/compare` - сравнение ВУЗов (демо)
- `/cart`, `/menu`, `/add-activity`, `/moderator` - дополнительные экраны

Защита `/profile` реализована в `loader`: если `isRegistered()` возвращает `false`, происходит `redirect('/register')`.

### 3) Хранение пользовательских данных

Используется `localStorage`:

- `src/app/lib/auth.ts`:
  - `isRegistered()` - проверка флага регистрации
  - `setRegistered(value)` - установка флага
  - `clearAuth()` - сброс
- `src/app/lib/profile.ts`:
  - `getProfile()` / `setProfile(profile)` / `clearProfile()`

Это демо-хранилище на клиенте; серверной синхронизации пока нет.

## Где и как написаны страницы

Все страницы лежат в `src/app/pages`.

- `DashboardPage.tsx`: главная витрина, рейтинг ВУЗов, фильтры, аналитика и графики.
- `UniversityPage.tsx`: детальная страница университета (статы, история, топ студентов, инфо).
- `CompareUniversitiesPage.tsx`: демо-сравнение двух ВУЗов.
- `RegistrationPage.tsx`, `LoginPage.tsx`, `ForgotPasswordPage.tsx`: auth-сценарии.
- `ProfilePage.tsx`: личный профиль (данные пользователя из `localStorage`).
- `ModeratorPage.tsx`: экран модерации (демо-функциональность).
- `AddActivityPage.tsx`: форма добавления активности.
- `MenuPage.tsx`, `CartPage.tsx`, `PersonalCabinetPage.tsx`: дополнительные интерфейсные страницы.

## Что уже оптимизировано

В текущей итерации выполнены безопасные рефакторинги:

- Вынесен общий UI-каркас auth-страниц в `AuthPageShell`, что убрало дублирование в `LoginPage`, `RegistrationPage`, `ForgotPasswordPage`.
- В `DashboardPage`:
  - вынесены статические демо-данные за пределы компонента (меньше лишних пересозданий объектов на ререндере);
  - добавлена `useMemo`-фильтрация по поиску и категории;
  - убран неиспользуемый элемент фильтра.
- В `RootLayout` вынесен массив навигации в константу вне компонента.

## Ограничения текущей версии

- Данные в основном демо-статические.
- Нет backend API и постоянного сервера данных.
- Авторизация и профиль реализованы как фронтенд-демо через `localStorage`.

## Рекомендации для следующего этапа

- Вынести все демо-данные страниц в отдельный слой (`src/app/data/*`).
- Добавить типизированный API-слой и клиент (`fetch/axios`) вместо локальных заглушек.
- Подключить линтер/форматтер (`ESLint`, `Prettier`) и тесты (`Vitest`, `React Testing Library`).
- Перейти на lazy-loading страниц в роутинге для уменьшения initial bundle.
  
  