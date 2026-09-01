import { AnimatePresence, motion } from 'framer-motion'
import { LOYALTY } from '../data'

interface Props {
  onHaptic?: () => void
}

export function LoyaltyPage({ onHaptic }: Props) {
  const progress = Math.min(100, ((LOYALTY.points % 1500) / 1500) * 100)

  return (
    <div>
      <motion.h1
        className="page-title"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Лояльность
      </motion.h1>
      <p className="muted" style={{ marginBottom: 18 }}>
        Баллы за визиты и привилегии уровня
      </p>

      <motion.div
        className="loyalty-card"
        initial={{ opacity: 0, y: 24, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformPerspective: 800 }}
        onClick={onHaptic}
      >
        <span className="chip loyalty-tier">{LOYALTY.tier}</span>
        <div className="loyalty-points">
          {LOYALTY.points.toLocaleString('ru-RU')}
          <small>баллов</small>
        </div>
        <p className="muted" style={{ marginTop: 6, position: 'relative', zIndex: 1 }}>
          До уровня «{LOYALTY.nextTier}» осталось {LOYALTY.pointsToNext}
        </p>
        <div className="progress" aria-hidden>
          <motion.span
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ delay: 0.35, duration: 0.9, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      <div className="stats">
        {[
          { value: `${LOYALTY.cashback}%`, label: 'кэшбэк' },
          { value: String(LOYALTY.visits), label: 'визитов' },
          { value: '1.5×', label: 'бонус' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="stat"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
          >
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </motion.div>
        ))}
      </div>

      <section className="section">
        <div className="section-head">
          <h2>История</h2>
        </div>
        <div className="panel">
          <div className="history-list">
            <AnimatePresence>
              {LOYALTY.history.map((item, i) => (
                <motion.div
                  key={item.id}
                  className="history-item"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.07 }}
                >
                  <div>
                    <strong>{item.title}</strong>
                    <p className="muted" style={{ fontSize: '0.84rem' }}>
                      {item.date}
                    </p>
                  </div>
                  <span className="plus">+{item.points}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  )
}
