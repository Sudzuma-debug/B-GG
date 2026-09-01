import { motion } from 'framer-motion'
import { LOYALTY } from '../data'

interface Props {
  name: string
}

export function ProfilePage({ name }: Props) {
  return (
    <div>
      <motion.div
        className="profile-head"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="avatar" style={{ width: 56, height: 56, fontSize: '1.2rem' }}>
          {name.slice(0, 1).toUpperCase()}
        </div>
        <div>
          <h1>{name}</h1>
          <p className="muted">Гость B&G studio</p>
        </div>
      </motion.div>

      <motion.div
        className="panel"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="confirm-box">
          <div className="confirm-row">
            <span>Уровень</span>
            <strong>{LOYALTY.tier}</strong>
          </div>
          <div className="confirm-row">
            <span>Баллы</span>
            <strong>{LOYALTY.points.toLocaleString('ru-RU')}</strong>
          </div>
          <div className="confirm-row">
            <span>Адрес</span>
            <strong>ул. Примерная, 12</strong>
          </div>
          <div className="confirm-row">
            <span>Часы</span>
            <strong>10:00 — 21:00</strong>
          </div>
        </div>
      </motion.div>

      <section className="section">
        <div className="section-head">
          <h2>Ближайший визит</h2>
        </div>
        <motion.div
          className="panel"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
        >
          <p className="muted">Пока нет активной записи</p>
          <p style={{ marginTop: 8 }}>Выберите услугу во вкладке «Запись»</p>
        </motion.div>
      </section>
    </div>
  )
}
