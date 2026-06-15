# UniVerse V4 - краткая карта проекта

Короткая карта проекта с самым важным: структура, страницы и текущая логика работы.

## 1) Ключевая структура

- `src/main.tsx` - точка входа React-приложения.
- `src/app/App.tsx` - подключает роутер (`RouterProvider`).
- `src/app/routes.tsx` - все маршруты и проверка доступа к профилю.
- `src/app/layouts/RootLayout.tsx` - общий каркас: шапка, навигация, подвал, `Outlet`.
- `src/app/pages/*` - страницы приложения (бизнес-экраны).
- `src/app/components/*` - прикладные переиспользуемые компоненты (`ActivityChart`, `StatsCard`, `UniversityCard`, `AuthPageShell`).
- `src/app/lib/auth.ts` - JWT cookie и флаг регистрации в `localStorage`.
- `src/app/lib/api.ts` - HTTP-клиент backend API (`register`, `login`, `profile`, справочники).
- `src/app/lib/profile.ts` - профиль пользователя в `localStorage` + синхронизация с API.
- `src/app/lib/claims.ts` - история заявок в `localStorage` (демо).
- `src/styles/*` - глобальные стили и тема.
- `.env` / `.env.example` - `VITE_API_BASE_URL` для подключения к backend.
- `VALIDATION_AND_BACKEND.txt` - временная справка по валидации и API.

## 2) Карта страниц (роуты)

- `/` - о проекте (`AboutPage`).
- `/dashboard` - рейтинг ВУЗов + аналитика (`DashboardPage`).
- `/register` - регистрация (`RegistrationPage`, API).
- `/login` - вход (`LoginPage`, API, JWT).
- `/forgot-password` - восстановление пароля (`ForgotPasswordPage`, демо).
- `/profile` - профиль (`ProfilePage`), защищённый маршрут (loader → `/register`).
- `/add-activity` - создание заявки (`AddActivityPage`); без регистрации — экран «Доступ ограничен».
- `/university/:id` - карточка университета (`UniversityPage`).
- `/compare` - сравнение университетов (`CompareUniversitiesPage`).
- `/moderator` - модерация (`ModeratorPage`).
- `/menu`, `/cart` - каталог товаров и корзина (демо).

## 3) Существующая логика проекта

### Авторизация и доступ

- Регистрация и вход работают через backend API (`api.ts`).
- JWT хранится в cookie (`universe_token`), флаг сессии — в `localStorage` (`universe:isRegistered`).
- `isRegistered()` = true, если есть JWT или флаг `"1"`.
- `/profile` — loader: редирект на `/register`, если не авторизован.
- `/add-activity` — проверка `isRegistered()` в компоненте: форма скрыта, показывается сообщение о необходимости регистрации.

### Профиль пользователя

- Данные профиля (`name`, `email`, `university`, `specialty`, `avatarDataUrl`) в `localStorage` (`universe:profile`).
- После входа — `GET /profile` для проверки доступа.
- Выход очищает cookie, флаг и профиль → `/login`.

### История заявок в профиле

- История отображается со статусами:
  - `На проверке`
  - `Принято`
  - `Отклонено`
  - `Дополнить`
- Есть фильтрация по вкладкам: `Все`, `На проверке`, `Принято`, `Отклонено`, `Дополнить`.
- Для заявок со статусом `Дополнить` доступна кнопка открытия модального окна.
- После отправки дополнения статус заявки меняется обратно на `На проверке`.

### Данные и аналитика

- На страницах (`Dashboard`, `University`, `Compare`, `Moderator`) используется демо-статический набор данных.
- `ActivityChart` и `StatsCard` переиспользуются в разных экранах для единообразной аналитики.
- Фильтрация на главной работает по поисковой строке и категории.

## 4) Текущее состояние архитектуры

- Архитектура модульная: `pages` + `components` + `lib`.
- UI-слой вынесен в отдельные переиспользуемые компоненты.
- Auth и справочники регистрации подключены к backend; остальные экраны — преимущественно демо-данные.
- Подробности валидации и API — в `VALIDATION_AND_BACKEND.txt` и `FUNCTIONALITY.md`.
