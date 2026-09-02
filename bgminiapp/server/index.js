import cors from 'cors'
import express from 'express'
import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'

// Настройка путей для работы с модулями ES
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = Number(process.env.PORT) || 3001
const BOT_TOKEN = process.env.BOT_TOKEN
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID

app.use(cors())
app.use(express.json())

// --- ТВОИ API РОУТЫ ---

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    telegramConfigured: Boolean(BOT_TOKEN && ADMIN_CHAT_ID),
  })
})

app.post('/api/book', async (req, res) => {
  try {
    if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
      res.status(500).json({
        ok: false,
        error: 'Сервер не настроен: укажите BOT_TOKEN и ADMIN_CHAT_ID в .env',
      })
      return
    }

    const {
      serviceName,
      masterName,
      date,
      time,
      price,
      clientName,
      clientUsername,
      telegramId,
    } = req.body ?? {}

    if (!serviceName || !masterName || !date || !time) {
      res.status(400).json({ ok: false, error: 'Не хватает данных записи' })
      return
    }

    const clientLine = [
      clientName || 'Гость',
      clientUsername ? `@${clientUsername}` : null,
      telegramId ? `id:${telegramId}` : null,
    ]
      .filter(Boolean)
      .join(' · ')

    const text = [
      '💚 Новая запись — B&G studio',
      '',
      `👤 Клиент: ${clientLine}`,
      `✨ Услуга: ${serviceName}`,
      `💅 Мастер: ${masterName}`,
      `📅 Когда: ${date}, ${time}`,
      price != null ? `💰 Сумма: ${price}` : null,
    ]
      .filter(Boolean)
      .join('\n')

    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        text,
      }),
    })

    const tgData = await tgRes.json()

    if (!tgRes.ok || !tgData.ok) {
      res.status(502).json({
        ok: false,
        error: tgData.description || 'Не удалось отправить в Telegram',
      })
      return
    }

    res.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ошибка сервера'
    res.status(500).json({ ok: false, error: message })
  }
})

// --- РАЗДАЧА ФРОНТЕНДА (Исправляет ошибку Cannot GET /) ---

// 1. Указываем серверу раздавать статику из папки dist (твой собранный Vite проект)
app.use(express.static(path.join(__dirname, '../dist')))

// 2. Если запрос не попал в API (например, обычный заход на сайт), отдаем главную страницу
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

app.listen(PORT, () => {
  console.log(`API: http://localhost:${PORT}`)
  if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
    console.warn('⚠ Заполните BOT_TOKEN и ADMIN_CHAT_ID в .env')
  }
})
