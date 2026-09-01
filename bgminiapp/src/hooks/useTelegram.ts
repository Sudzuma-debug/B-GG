import { useEffect, useMemo } from 'react'

export function useTelegram() {
  const tg = useMemo(() => window.Telegram?.WebApp, [])

  useEffect(() => {
    if (!tg) return
    tg.ready()
    tg.expand()
    tg.setHeaderColor?.('#0B0B0C')
    tg.setBackgroundColor?.('#0B0B0C')
  }, [tg])

  const user = tg?.initDataUnsafe?.user
  const firstName = user?.first_name ?? 'Гость'

  const haptic = (style: 'light' | 'medium' | 'heavy' = 'light') => {
    tg?.HapticFeedback?.impactOccurred(style)
  }

  const notify = (type: 'error' | 'success' | 'warning') => {
    tg?.HapticFeedback?.notificationOccurred(type)
  }

  return { tg, user, firstName, haptic, notify }
}
