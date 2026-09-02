import type { Completion, Habit } from '../types'

export const HABITS_KEY = 'routine-habits'
export const COMPLETIONS_KEY = 'routine-completions'
export const SEEDED_KEY = 'routine-seeded'
export const LAST_USER_KEY = 'routine-last-user'

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

const LEGACY_SEED_IDS: Record<string, string> = {
  'seed-wake': 'a1e1c7e0-1c11-4b11-8a11-000000000001',
  'seed-gym': 'a1e1c7e0-1c11-4b11-8a11-000000000002',
  'seed-meditate': 'a1e1c7e0-1c11-4b11-8a11-000000000003',
  'seed-read': 'a1e1c7e0-1c11-4b11-8a11-000000000004',
}

export const SEED_HABITS: Habit[] = [
  {
    id: LEGACY_SEED_IDS['seed-wake'],
    name: 'Wake up',
    type: 'daily',
    timeLabel: '8:00 AM',
    emoji: '☀️',
  },
  {
    id: LEGACY_SEED_IDS['seed-gym'],
    name: 'Gym',
    type: 'weekly_target',
    weeklyTarget: 5,
    emoji: '🏋️',
  },
  {
    id: LEGACY_SEED_IDS['seed-meditate'],
    name: 'Meditate',
    type: 'scheduled',
    scheduledDays: [1, 3, 5],
    emoji: '🧘',
  },
  {
    id: LEGACY_SEED_IDS['seed-read'],
    name: 'Read 20 min',
    type: 'daily',
    emoji: '📖',
  },
]

function remapLegacyId(id: string): string {
  return LEGACY_SEED_IDS[id] ?? id
}

function migrateLegacyIds(
  habits: Habit[],
  completions: Completion[],
): { habits: Habit[]; completions: Completion[] } {
  const nextHabits = habits.map((h) => ({ ...h, id: remapLegacyId(h.id) }))
  const nextCompletions = completions.map((c) => ({
    ...c,
    habitId: remapLegacyId(c.habitId),
  }))

  const changed =
    nextHabits.some((h, i) => h.id !== habits[i].id) ||
    nextCompletions.some((c, i) => c.habitId !== completions[i].habitId)

  if (changed) {
    saveToStorage(HABITS_KEY, nextHabits)
    saveToStorage(COMPLETIONS_KEY, nextCompletions)
  }

  return { habits: nextHabits, completions: nextCompletions }
}

export function readLocalRoutine(allowSeed: boolean): {
  habits: Habit[]
  completions: Completion[]
} {
  const alreadySeeded = localStorage.getItem(SEEDED_KEY)
  const habits = loadFromStorage<Habit[]>(HABITS_KEY, [])
  const completions = loadFromStorage<Completion[]>(COMPLETIONS_KEY, [])

  if (alreadySeeded || habits.length > 0) {
    return migrateLegacyIds(habits, completions)
  }

  if (!allowSeed) {
    return { habits: [], completions: [] }
  }

  saveToStorage(HABITS_KEY, SEED_HABITS)
  saveToStorage(COMPLETIONS_KEY, [])
  localStorage.setItem(SEEDED_KEY, 'true')
  return { habits: SEED_HABITS, completions: [] }
}

export function seedIfEmpty(): { habits: Habit[]; completions: Completion[] } {
  return readLocalRoutine(true)
}
