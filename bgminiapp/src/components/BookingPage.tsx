import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import {
  MASTERS,
  SERVICES,
  formatPrice,
  getSlotsForDate,
  getUpcomingDates,
  type BookingDraft,
} from '../data'

interface Props {
  clientName?: string
  clientUsername?: string
  telegramId?: number
  onHaptic?: (style?: 'light' | 'medium' | 'heavy') => void
  onSuccess?: () => void
}

const stepLabels = ['Услуга', 'Мастер', 'Время', 'Готово']
const API_URL = import.meta.env.VITE_API_URL || ''

export function BookingPage({
  clientName,
  clientUsername,
  telegramId,
  onHaptic,
  onSuccess,
}: Props) {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [draft, setDraft] = useState<BookingDraft>({
    serviceId: null,
    masterId: null,
    date: null,
    time: null,
  })

  const dates = useMemo(() => getUpcomingDates(7), [])
  const service = SERVICES.find((s) => s.id === draft.serviceId)
  const master = MASTERS.find((m) => m.id === draft.masterId)
  const slots = draft.date && draft.masterId ? getSlotsForDate(draft.date, draft.masterId) : []

  const select = (patch: Partial<BookingDraft>, nextStep: number) => {
    onHaptic?.('light')
    setDraft((prev) => ({ ...prev, ...patch }))
    setStep(nextStep)
  }

  const confirm = async () => {
    if (!service || !master || !draft.date || !draft.time || submitting) return

    onHaptic?.('medium')
    setSubmitting(true)
    setError(null)

    const dateLabel = dates.find((d) => d.iso === draft.date)?.label ?? draft.date

    try {
      const res = await fetch(`${API_URL}/api/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceName: service.name,
          masterName: master.name,
          date: dateLabel,
          time: draft.time,
          price: formatPrice(service.price),
          clientName: clientName || 'Гость',
          clientUsername: clientUsername || null,
          telegramId: telegramId || null,
        }),
      })

      const data = (await res.json()) as { ok?: boolean; error?: string }

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Не удалось отправить запись')
      }

      setDone(true)
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка отправки')
      onHaptic?.('heavy')
    } finally {
      setSubmitting(false)
    }
  }

  if (done && service && master && draft.date && draft.time) {
    const dateLabel = dates.find((d) => d.iso === draft.date)?.label ?? draft.date
    return (
      <motion.div
        className="success"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      >
        <div className="success-mark">✓</div>
        <h1 className="page-title">Вы записаны</h1>
        <p className="muted" style={{ marginBottom: 20 }}>
          {service.name} · {master.name}
          <br />
          {dateLabel}, {draft.time}
        </p>
        <p className="chip">Заявка ушла владельцу в Telegram</p>
        <div style={{ marginTop: 24 }}>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => {
              setDone(false)
              setStep(0)
              setError(null)
              setDraft({ serviceId: null, masterId: null, date: null, time: null })
            }}
          >
            Новая запись
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div>
      <motion.h1
        className="page-title"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Запись
      </motion.h1>
      <p className="muted">Шаг {Math.min(step + 1, 3)} из 3 — {stepLabels[step]}</p>

      <div className="steps" aria-hidden>
        {stepLabels.slice(0, 3).map((_, i) => (
          <div key={i} className={`step-dot${i <= step ? ' active' : ''}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="services"
            className="service-list"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28 }}
          >
            {SERVICES.map((item, i) => (
              <motion.button
                key={item.id}
                type="button"
                className={`service-card${draft.serviceId === item.id ? ' selected' : ''}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => select({ serviceId: item.id }, 1)}
              >
                <div className="service-top">
                  <strong>{item.name}</strong>
                  <span className="price">{formatPrice(item.price)}</span>
                </div>
                <p className="muted" style={{ fontSize: '0.9rem' }}>
                  {item.description}
                </p>
                <div className="meta">
                  <span>{item.duration} мин</span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="masters"
            className="master-list"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28 }}
          >
            <button
              className="btn btn-ghost"
              type="button"
              style={{ width: 'fit-content', marginBottom: 4 }}
              onClick={() => setStep(0)}
            >
              ← Назад
            </button>
            {MASTERS.map((item, i) => (
              <motion.button
                key={item.id}
                type="button"
                className={`master-card${draft.masterId === item.id ? ' selected' : ''}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => select({ masterId: item.id, date: dates[0]?.iso ?? null, time: null }, 2)}
              >
                <div className="avatar">{item.avatar}</div>
                <div>
                  <div className="master-top">
                    <strong>{item.name}</strong>
                    <span className="price">★ {item.rating.toFixed(1)}</span>
                  </div>
                  <p className="muted" style={{ fontSize: '0.88rem' }}>
                    {item.role} · {item.experience}
                  </p>
                  <div className="meta" style={{ marginTop: 6 }}>
                    {item.specialties.map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="time"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28 }}
          >
            <button
              className="btn btn-ghost"
              type="button"
              style={{ width: 'fit-content', marginBottom: 12 }}
              onClick={() => setStep(1)}
            >
              ← Назад
            </button>

            <div className="section-head">
              <h2>Дата</h2>
            </div>
            <div className="date-row">
              {dates.map((d) => (
                <button
                  key={d.iso}
                  type="button"
                  className={`date-pill${draft.date === d.iso ? ' selected' : ''}`}
                  onClick={() => {
                    onHaptic?.()
                    setDraft((prev) => ({ ...prev, date: d.iso, time: null }))
                  }}
                >
                  <span className="weekday">{d.weekday}</span>
                  <strong>{d.label}</strong>
                </button>
              ))}
            </div>

            <div className="section-head" style={{ marginTop: 20 }}>
              <h2>Время</h2>
            </div>
            <div className="slot-grid">
              {slots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  className={`slot${draft.time === slot.time ? ' selected' : ''}`}
                  disabled={!slot.available}
                  onClick={() => {
                    onHaptic?.()
                    setDraft((prev) => ({ ...prev, time: slot.time }))
                    setStep(3)
                  }}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && service && master && draft.date && draft.time && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28 }}
          >
            <button
              className="btn btn-ghost"
              type="button"
              style={{ width: 'fit-content', marginBottom: 12 }}
              onClick={() => setStep(2)}
            >
              ← Назад
            </button>

            <div className="panel confirm-box">
              <div className="confirm-row">
                <span>Услуга</span>
                <strong>{service.name}</strong>
              </div>
              <div className="confirm-row">
                <span>Мастер</span>
                <strong>{master.name}</strong>
              </div>
              <div className="confirm-row">
                <span>Когда</span>
                <strong>
                  {dates.find((d) => d.iso === draft.date)?.label}, {draft.time}
                </strong>
              </div>
              <div className="confirm-row">
                <span>Сумма</span>
                <strong className="price">{formatPrice(service.price)}</strong>
              </div>
            </div>

            {error && (
              <p className="muted" style={{ color: 'var(--danger)', marginTop: 12 }}>
                {error}
              </p>
            )}

            <button
              className="btn btn-primary"
              type="button"
              style={{ width: '100%', marginTop: 16 }}
              disabled={submitting}
              onClick={() => void confirm()}
            >
              {submitting ? 'Отправка…' : 'Подтвердить запись'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
