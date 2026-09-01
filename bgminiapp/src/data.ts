export type TabId = 'home' | 'book' | 'loyalty' | 'profile'

export interface Service {
  id: string
  name: string
  duration: number
  price: number
  description: string
  category: 'hair' | 'nails' | 'face' | 'combo' | 'brows'
}

export interface Master {
  id: string
  name: string
  role: string
  rating: number
  experience: string
  specialties: string[]
  avatar: string
}

export interface TimeSlot {
  time: string
  available: boolean
}

export interface BookingDraft {
  serviceId: string | null
  masterId: string | null
  date: string | null
  time: string | null
}

export const SERVICES: Service[] = [
  {
    id: 'haircut',
    name: 'Женская стрижка',
    duration: 60,
    price: 2500,
    description: 'Модельная стрижка с укладкой',
    category: 'hair',
  },
  {
    id: 'color',
    name: 'Окрашивание',
    duration: 120,
    price: 4500,
    description: 'Тонирование, мелирование, сложное окрашивание',
    category: 'hair',
  },
  {
    id: 'styling',
    name: 'Укладка',
    duration: 45,
    price: 1800,
    description: 'Вечерняя или повседневная укладка',
    category: 'hair',
  },
  {
    id: 'manicure',
    name: 'Маникюр',
    duration: 75,
    price: 2200,
    description: 'Классический или аппаратный маникюр',
    category: 'nails',
  },
  {
    id: 'pedicure',
    name: 'Педикюр',
    duration: 90,
    price: 2800,
    description: 'Уход за стопами и покрытие',
    category: 'nails',
  },
  {
    id: 'brows',
    name: 'Брови и ресницы',
    duration: 60,
    price: 1500,
    description: 'Коррекция, окрашивание, ламинирование',
    category: 'brows',
  },
  {
    id: 'facial',
    name: 'Уход за лицом',
    duration: 75,
    price: 3200,
    description: 'Чистка, пилинг, увлажняющий уход',
    category: 'face',
  },
  {
    id: 'combo',
    name: 'Комплекс «Образ»',
    duration: 150,
    price: 5500,
    description: 'Стрижка + укладка + маникюр',
    category: 'combo',
  },
]

export const MASTERS: Master[] = [
  {
    id: 'a',
    name: 'Анна',
    role: 'Стилист',
    rating: 4.9,
    experience: '9 лет',
    specialties: ['Стрижки', 'Укладки'],
    avatar: 'А',
  },
  {
    id: 'b',
    name: 'Белла',
    role: 'Колорист',
    rating: 4.8,
    experience: '7 лет',
    specialties: ['Окрашивание', 'Блонд'],
    avatar: 'Б',
  },
  {
    id: 'c',
    name: 'Галина',
    role: 'Nail-мастер',
    rating: 5.0,
    experience: '6 лет',
    specialties: ['Маникюр', 'Педикюр'],
    avatar: 'Г',
  },
]

export const LOYALTY = {
  points: 1580,
  tier: 'Изумруд',
  nextTier: 'Платина',
  pointsToNext: 420,
  cashback: 8,
  visits: 22,
  history: [
    { id: '1', title: 'Окрашивание', points: 180, date: '18 авг' },
    { id: '2', title: 'Маникюр', points: 90, date: '2 авг' },
    { id: '3', title: 'Женская стрижка', points: 100, date: '15 июл' },
  ],
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('ru-RU').format(value) + ' ₽'
}

export function getUpcomingDates(count = 7): { iso: string; label: string; weekday: string }[] {
  const days = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']
  const months = [
    'янв', 'фев', 'мар', 'апр', 'май', 'июн',
    'июл', 'авг', 'сен', 'окт', 'ноя', 'дек',
  ]
  const result: { iso: string; label: string; weekday: string }[] = []
  const now = new Date()

  for (let i = 0; i < count; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() + i)
    const iso = d.toISOString().slice(0, 10)
    result.push({
      iso,
      label: `${d.getDate()} ${months[d.getMonth()]}`,
      weekday: i === 0 ? 'сегодня' : days[d.getDay()],
    })
  }

  return result
}

export function getSlotsForDate(date: string, masterId: string): TimeSlot[] {
  const base = ['10:00', '11:00', '12:00', '13:30', '15:00', '16:00', '17:30', '19:00']
  const seed = [...date, ...masterId].reduce((acc, ch) => acc + ch.charCodeAt(0), 0)

  return base.map((time, index) => ({
    time,
    available: (seed + index) % 4 !== 0,
  }))
}
