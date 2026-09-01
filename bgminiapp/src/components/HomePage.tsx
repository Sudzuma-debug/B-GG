import { motion } from 'framer-motion'
import type { TabId } from '../data'

interface Props {
  name: string
  onNavigate: (tab: TabId) => void
}

export function HomePage({ name, onNavigate }: Props) {
  return (
    <section className="hero">
      <div className="hero-visual" aria-hidden>
        <motion.div
          className="hero-bloom"
          initial={{ opacity: 0, rotate: -12, scale: 0.9 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <div className="hero-content">
        <motion.p
          className="chip"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          Привет, {name}
        </motion.p>

        <motion.h1
          className="brand"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          B&G <span>studio</span>
        </motion.h1>

        <motion.p
          className="hero-lead"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Салон красоты: стрижки, окрашивание, маникюр и уход. Запись онлайн за минуту.
        </motion.p>

        <motion.div
          className="cta-row"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <button className="btn btn-primary" type="button" onClick={() => onNavigate('book')}>
            Записаться
          </button>
          <button className="btn btn-ghost" type="button" onClick={() => onNavigate('loyalty')}>
            Мои баллы
          </button>
        </motion.div>
      </div>
    </section>
  )
}
