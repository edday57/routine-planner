import type { Completion, Habit } from '../types'

export const HABITS_KEY = 'routine-habits'
export const COMPLETIONS_KEY = 'routine-completions'
export const SEEDED_KEY = 'routine-seeded'

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export const SEED_HABITS: Habit[] = [
  {
    id: 'seed-wake',
    name: 'Wake up',
    type: 'daily',
    timeLabel: '8:00 AM',
    emoji: '☀️',
  },
  {
    id: 'seed-gym',
    name: 'Gym',
    type: 'weekly_target',
    weeklyTarget: 5,
    emoji: '🏋️',
  },
  {
    id: 'seed-meditate',
    name: 'Meditate',
    type: 'scheduled',
    scheduledDays: [1, 3, 5],
    emoji: '🧘',
  },
  {
    id: 'seed-read',
    name: 'Read 20 min',
    type: 'daily',
    emoji: '📖',
  },
]

export function seedIfEmpty(): { habits: Habit[]; completions: Completion[] } {
  const alreadySeeded = localStorage.getItem(SEEDED_KEY)
  const habits = loadFromStorage<Habit[]>(HABITS_KEY, [])
  const completions = loadFromStorage<Completion[]>(COMPLETIONS_KEY, [])

  if (alreadySeeded || habits.length > 0) {
    return { habits, completions }
  }

  saveToStorage(HABITS_KEY, SEED_HABITS)
  saveToStorage(COMPLETIONS_KEY, [])
  localStorage.setItem(SEEDED_KEY, 'true')
  return { habits: SEED_HABITS, completions: [] }
}
