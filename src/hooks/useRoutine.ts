import { useCallback, useEffect, useState } from 'react'
import type { Completion, Habit } from '../types'
import {
  COMPLETIONS_KEY,
  HABITS_KEY,
  LAST_USER_KEY,
  saveToStorage,
  seedIfEmpty,
} from '../lib/storage'
import { habitToInsert } from '../lib/mappers'
import { fetchRemoteRoutine, uploadLocalRoutine } from '../lib/sync'
import { supabase } from '../lib/supabase'

function generateId(): string {
  return crypto.randomUUID()
}

export function useRoutine(userId: string | undefined, authReady: boolean) {
  const [habits, setHabits] = useState<Habit[]>([])
  const [completions, setCompletions] = useState<Completion[]>([])
  const [ready, setReady] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)

  useEffect(() => {
    if (!authReady) return

    let cancelled = false

    async function load() {
      setReady(false)
      setSyncError(null)

      const local = seedIfEmpty()

      if (!userId || !supabase) {
        if (cancelled) return
        setHabits(local.habits)
        setCompletions(local.completions)
        setReady(true)
        return
      }

      try {
        const remote = await fetchRemoteRoutine(userId)
        if (cancelled) return

        const lastUser = localStorage.getItem(LAST_USER_KEY)
        const localBelongsHere = !lastUser || lastUser === userId

        if (remote.habits.length === 0 && local.habits.length > 0 && localBelongsHere) {
          await uploadLocalRoutine(userId, local.habits, local.completions)
          setHabits(local.habits)
          setCompletions(local.completions)
        } else {
          setHabits(remote.habits)
          setCompletions(remote.completions)
          saveToStorage(HABITS_KEY, remote.habits)
          saveToStorage(COMPLETIONS_KEY, remote.completions)
        }

        localStorage.setItem(LAST_USER_KEY, userId)
      } catch (error) {
        if (cancelled) return
        setHabits(local.habits)
        setCompletions(local.completions)
        setSyncError(
          error instanceof Error ? error.message : 'Could not sync with the cloud.',
        )
      } finally {
        if (!cancelled) setReady(true)
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [authReady, userId])

  const persistHabits = useCallback(
    (next: Habit[]) => {
      setHabits(next)
      saveToStorage(HABITS_KEY, next)
    },
    [],
  )

  const persistCompletions = useCallback((next: Completion[]) => {
    setCompletions(next)
    saveToStorage(COMPLETIONS_KEY, next)
  }, [])

  const addHabit = useCallback(
    async (input: Omit<Habit, 'id'>) => {
      const habit: Habit = { ...input, id: generateId() }
      const next = [...habits, habit]
      persistHabits(next)

      if (!userId || !supabase) return

      const { error } = await supabase
        .from('habits')
        .insert(habitToInsert(habit, userId, next.length - 1))
      if (error) setSyncError(error.message)
    },
    [habits, persistHabits, userId],
  )

  const updateHabit = useCallback(
    async (id: string, updates: Partial<Omit<Habit, 'id'>>) => {
      const next = habits.map((h) => (h.id === id ? { ...h, ...updates } : h))
      persistHabits(next)

      if (!userId || !supabase) return

      const updated = next.find((h) => h.id === id)
      if (!updated) return

      const row = habitToInsert(updated, userId, next.findIndex((h) => h.id === id))
      const { error } = await supabase.from('habits').update(row).eq('id', id)
      if (error) setSyncError(error.message)
    },
    [habits, persistHabits, userId],
  )

  const deleteHabit = useCallback(
    async (id: string) => {
      persistHabits(habits.filter((h) => h.id !== id))
      persistCompletions(completions.filter((c) => c.habitId !== id))

      if (!userId || !supabase) return

      const { error } = await supabase.from('habits').delete().eq('id', id)
      if (error) setSyncError(error.message)
    },
    [completions, habits, persistCompletions, persistHabits, userId],
  )

  const toggleCompletion = useCallback(
    async (habitId: string, date: string) => {
      const exists = completions.some(
        (c) => c.habitId === habitId && c.date === date,
      )
      const next = exists
        ? completions.filter((c) => !(c.habitId === habitId && c.date === date))
        : [...completions, { habitId, date }]

      persistCompletions(next)

      if (!userId || !supabase) return

      if (exists) {
        const { error } = await supabase
          .from('completions')
          .delete()
          .eq('habit_id', habitId)
          .eq('completed_on', date)
        if (error) setSyncError(error.message)
        return
      }

      const { error } = await supabase.from('completions').insert({
        user_id: userId,
        habit_id: habitId,
        completed_on: date,
      })
      if (error) setSyncError(error.message)
    },
    [completions, persistCompletions, userId],
  )

  return {
    habits,
    completions,
    ready,
    syncError,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
  }
}
