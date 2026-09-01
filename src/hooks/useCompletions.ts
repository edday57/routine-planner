import { useCallback, useState } from 'react'
import type { Completion } from '../types'
import { COMPLETIONS_KEY, saveToStorage, seedIfEmpty } from '../lib/storage'

export function useCompletions() {
  const [completions, setCompletions] = useState<Completion[]>(
    () => seedIfEmpty().completions,
  )

  const persist = useCallback((next: Completion[]) => {
    setCompletions(next)
    saveToStorage(COMPLETIONS_KEY, next)
  }, [])

  const toggleCompletion = useCallback(
    (habitId: string, date: string) => {
      const exists = completions.some(
        (c) => c.habitId === habitId && c.date === date,
      )
      const next = exists
        ? completions.filter(
            (c) => !(c.habitId === habitId && c.date === date),
          )
        : [...completions, { habitId, date }]
      persist(next)
    },
    [completions, persist],
  )

  const isComplete = useCallback(
    (habitId: string, date: string) => {
      return completions.some(
        (c) => c.habitId === habitId && c.date === date,
      )
    },
    [completions],
  )

  return { completions, toggleCompletion, isComplete }
}
