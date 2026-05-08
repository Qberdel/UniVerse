# Карта проекта UniVerse V4

Документ описывает назначение каждого ключевого файла проекта (без `node_modules` и артефактов сборки из `dist`).

## 1) Корень проекта

- `README.md` - основная документация: стек, запуск, структура, архитектура.
- `PROJECT_MAP.md` - эта карта файлов и страниц проекта.
- `ATTRIBUTIONS.md` - список атрибуций/источников для используемых материалов.
- `index.html` - HTML-шаблон приложения, контейнер `#root` для React.
- `package.json` - зависимости и npm-скрипты (`dev`, `build`).
- `package-lock.json` - lock-файл npm с зафиксированными версиями пакетов.
- `pnpm-workspace.yaml` - конфиг workspace для pnpm (если используется pnpm).
- `postcss.config.mjs` - конфигурация PostCSS/Tailwind обработки CSS.
- `vite.config.ts` - конфигурация Vite (плагины React/Tailwind, алиасы, assetsInclude).
- `default_shadcn_theme.css` - тема/переменные стилей для набора UI-компонентов.
- `UniVerse.drawio` - схема проекта в формате diagrams.net (архитектурная диаграмма).

## 2) Методические материалы

- `guidelines/Guidelines.md` - внутренние рекомендации/правила по проекту.

## 3) Точка входа и каркас приложения

- `src/main.tsx` - точка входа React, монтирование приложения.
- `src/app/App.tsx` - обертка с `RouterProvider`, подключение маршрутизации.
- `src/app/routes.tsx` - конфигурация всех маршрутов приложения и guard для профиля.
- `src/app/layouts/RootLayout.tsx` - общий layout (header/nav/footer и `Outlet`).

## 4) Страницы (карта сайта)

- `src/app/pages/DashboardPage.tsx` - главная страница: рейтинг ВУЗов, фильтры, аналитика.
- `src/app/pages/UniversityPage.tsx` - страница университета по `:id`, метрики и разделы.
- `src/app/pages/CompareUniversitiesPage.tsx` - сравнение двух ВУЗов (демо-логика).
- `src/app/pages/ProfilePage.tsx` - профиль пользователя, история заявок, редактирование.
- `src/app/pages/RegistrationPage.tsx` - регистрация пользователя.
- `src/app/pages/LoginPage.tsx` - вход пользователя.
- `src/app/pages/ForgotPasswordPage.tsx` - восстановление пароля (демо-поток).
- `src/app/pages/AddActivityPage.tsx` - добавление новой активности/заявки.
- `src/app/pages/ModeratorPage.tsx` - модерация заявок и действий (демо).
- `src/app/pages/MenuPage.tsx` - дополнительная страница меню/навигации.
- `src/app/pages/CartPage.tsx` - страница корзины/выбранных элементов.
- `src/app/pages/PersonalCabinetPage.tsx` - альтернативный вариант личного кабинета.

## 5) Бизнес-логика и локальное хранилище

- `src/app/lib/auth.ts` - работа с флагом регистрации/авторизации в `localStorage`.
- `src/app/lib/profile.ts` - чтение/запись профиля пользователя в `localStorage`.

## 6) Компоненты предметной области

- `src/app/components/AuthPageShell.tsx` - общий каркас для страниц авторизации.
- `src/app/components/UniversityCard.tsx` - карточка университета в рейтинге.
- `src/app/components/ActivityChart.tsx` - универсальный график активности/метрик.
- `src/app/components/StatsCard.tsx` - карточка метрики для dashboard/аналитики.
- `src/app/components/figma/ImageWithFallback.tsx` - картинка с fallback при ошибке загрузки.

## 7) UI-компоненты (`src/app/components/ui`)

Ниже - базовые переиспользуемые UI-кирпичики интерфейса.

- `accordion.tsx` - аккордеон (раскрывающиеся секции).
- `alert-dialog.tsx` - модальное подтверждение критичных действий.
- `alert.tsx` - компонент уведомления/сообщения.
- `aspect-ratio.tsx` - контейнер с фиксированным соотношением сторон.
- `avatar.tsx` - аватар пользователя.
- `badge.tsx` - бейдж/статус-лейбл.
- `breadcrumb.tsx` - хлебные крошки навигации.
- `button.tsx` - кнопка с вариантами стиля.
- `calendar.tsx` - календарь выбора дат.
- `card.tsx` - карточка-контейнер контента.
- `carousel.tsx` - карусель/слайдер контента.
- `chart.tsx` - вспомогательная UI-обертка для графиков.
- `checkbox.tsx` - чекбокс.
- `collapsible.tsx` - сворачиваемый блок.
- `command.tsx` - command-палитра/поисковое меню.
- `context-menu.tsx` - контекстное меню.
- `dialog.tsx` - модальное окно.
- `drawer.tsx` - выезжающая панель (drawer).
- `dropdown-menu.tsx` - выпадающее меню.
- `form.tsx` - утилиты для построения форм.
- `hover-card.tsx` - всплывающая карточка при наведении.
- `input-otp.tsx` - поля ввода OTP-кода.
- `input.tsx` - текстовое поле ввода.
- `label.tsx` - подпись поля формы.
- `menubar.tsx` - горизонтальное меню.
- `navigation-menu.tsx` - навигационное меню.
- `pagination.tsx` - пагинация.
- `popover.tsx` - popover-окно.
- `progress.tsx` - индикатор прогресса.
- `radio-group.tsx` - группа радиокнопок.
- `resizable.tsx` - изменяемые по размеру панели.
- `scroll-area.tsx` - кастомная область скролла.
- `select.tsx` - select (выпадающий выбор).
- `separator.tsx` - визуальный разделитель.
- `sheet.tsx` - боковая/нижняя панель (sheet).
- `sidebar.tsx` - сайдбар и его блоки.
- `skeleton.tsx` - скелетон-заглушка загрузки.
- `slider.tsx` - слайдер диапазона.
- `sonner.tsx` - тост-уведомления.
- `switch.tsx` - переключатель (toggle switch).
- `table.tsx` - таблица и составные элементы.
- `tabs.tsx` - вкладки.
- `textarea.tsx` - многострочное поле ввода.
- `toggle-group.tsx` - группа toggle-кнопок.
- `toggle.tsx` - одиночная toggle-кнопка.
- `tooltip.tsx` - всплывающая подсказка.
- `use-mobile.ts` - хук определения мобильного режима/брейкпоинта.
- `utils.ts` - утилиты для классов и вспомогательных UI-функций.

## 8) Стили

- `src/styles/index.css` - глобальные стили, подключаемые в `main.tsx`.
- `src/styles/theme.css` - переменные темы и дизайн-токены.
- `src/styles/tailwind.css` - базовые импорты/слои Tailwind.

## 9) Навигационная карта страниц

- `/` - `DashboardPage`
- `/register` - `RegistrationPage`
- `/login` - `LoginPage`
- `/forgot-password` - `ForgotPasswordPage`
- `/profile` - `ProfilePage` (защищен проверкой регистрации)
- `/university/:id` - `UniversityPage`
- `/compare` - `CompareUniversitiesPage`
- `/add-activity` - `AddActivityPage`
- `/moderator` - `ModeratorPage`
- `/menu` - `MenuPage`
- `/cart` - `CartPage`
