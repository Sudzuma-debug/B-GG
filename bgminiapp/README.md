# B&G studio — Telegram Mini App

Мини-приложение записи в салон красоты: React + Vite + Express API.
Заказы уходят вам сообщением в Telegram.

## Важно про токен

Токен бота **нельзя** класть во фронтенд — его увидят все.
Он хранится только в `.env` на сервере.

Если токен уже светился в чате — перевыпустите его в [@BotFather](https://t.me/BotFather) → `/revoke`.

## База данных

Сейчас **базы нет**. Заказы не сохраняются — только уведомление в Telegram.
Для продакшена позже можно добавить SQLite / Postgres.

## Запуск локально

1. Скопируйте `.env.example` → `.env` и заполните:
   - `BOT_TOKEN` — токен от BotFather
   - `ADMIN_CHAT_ID` — ваш chat id (напишите боту `/start`, затем узнайте id через [@userinfobot](https://t.me/userinfobot))

2. Установите зависимости и запустите API + фронт:

```bash
npm install
npm run dev:api
```

В другом терминале:

```bash
npm run dev
```

Откройте http://localhost:5173/mini-app/

## Деплой

- **Фронт:** GitHub Pages (уже настроено)
- **API:** нужен любой хост с Node (Railway, Render, Fly.io). После деплоя задайте `VITE_API_URL=https://ваш-api...` перед `npm run build`.

## Стек

- React 19 + Vite + TypeScript
- Framer Motion
- Express (уведомления в Telegram)
- Telegram WebApp SDK
