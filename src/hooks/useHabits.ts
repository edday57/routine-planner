import { useCallback, useState } from 'react'
import type { Habit } from '../types'
import { HABITS_KEY, saveToStorage, seedIfEmpty } from '../lib/storage'

function generateId(): string {
  return crypto.randomUUID()
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(() => seedIfEmpty().habits)

  const persist = useCallback((next: Habit[]) => {
    setHabits(next)
    saveToStorage(HABITS_KEY, next)
  }, [])

  const addHabit = useCallback(
    (habit: Omit<Habit, 'id'>) => {
      const next = [...habits, { ...habit, id: generateId() }]
      persist(next)
    },
    [habits, persist],
  )

  const updateHabit = useCallback(
    (id: string, updates: Partial<Omit<Habit, 'id'>>) => {
      const next = habits.map((h) => (h.id === id ? { ...h, ...updates } : h))
      persist(next)
    },
    [habits, persist],
  )

  const deleteHabit = useCallback(
    (id: string) => {
      persist(habits.filter((h) => h.id !== id))
    },
    [habits, persist],
  )

  return { habits, addHabit, updateHabit, deleteHabit }
}
