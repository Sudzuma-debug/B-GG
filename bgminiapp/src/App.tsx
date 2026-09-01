import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { BookingPage } from './components/BookingPage'
import { BottomNav } from './components/BottomNav'
import { HomePage } from './components/HomePage'
import { LoyaltyPage } from './components/LoyaltyPage'
import { ProfilePage } from './components/ProfilePage'
import type { TabId } from './data'
import { useTelegram } from './hooks/useTelegram'

const pageMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
}

export default function App() {
  const [tab, setTab] = useState<TabId>('home')
  const { firstName, user, haptic, notify } = useTelegram()

  const changeTab = (next: TabId) => {
    haptic('light')
    setTab(next)
  }

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        <motion.div key={tab} className="fade-page" {...pageMotion}>
          {tab === 'home' && <HomePage name={firstName} onNavigate={changeTab} />}
          {tab === 'book' && (
            <BookingPage
              clientName={firstName}
              clientUsername={user?.username}
              telegramId={user?.id}
              onHaptic={haptic}
              onSuccess={() => notify('success')}
            />
          )}
          {tab === 'loyalty' && <LoyaltyPage onHaptic={() => haptic('light')} />}
          {tab === 'profile' && <ProfilePage name={firstName} />}
        </motion.div>
      </AnimatePresence>

      <BottomNav active={tab} onChange={changeTab} />
    </div>
  )
}
