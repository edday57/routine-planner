import { useCallback, useEffect, useState } from 'react'
import type { Goal, GoalStep } from '../types'
import { mergeGoals } from '../lib/merge'
import {
  GOALS_KEY,
  GOAL_STEPS_KEY,
  LAST_USER_KEY,
  readLocalGoals,
  saveToStorage,
} from '../lib/storage'
import { goalToInsert } from '../lib/mappers'
import { fetchRemoteGoals, uploadLocalGoals } from '../lib/sync'
import { supabase } from '../lib/supabase'
import { formatDate } from '../lib/weekUtils'
import { hapticSuccess } from '../lib/haptics'

function generateId(): string {
  return crypto.randomUUID()
}

export function useGoals(userId: string | undefined, authReady: boolean) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [steps, setSteps] = useState<GoalStep[]>([])
  const [ready, setReady] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)

  useEffect(() => {
    if (!authReady) return

    let cancelled = false

    async function load() {
      setReady(false)
      setSyncError(null)
      const local = readLocalGoals()

      if (!userId || !supabase) {
        if (cancelled) return
        setGoals(local.goals)
        setSteps(local.steps)
        setReady(true)
        return
      }

      try {
        const remote = await fetchRemoteGoals(userId)
        if (cancelled) return

        const lastUser = localStorage.getItem(LAST_USER_KEY)
        const localBelongsHere = !lastUser || lastUser === userId
        const localToMerge = localBelongsHere
          ? local
          : { goals: [], steps: [] }

        const merged = mergeGoals(localToMerge, remote)
        await uploadLocalGoals(userId, merged.goals, merged.steps)

        if (cancelled) return
        setGoals(merged.goals)
        setSteps(merged.steps)
        saveToStorage(GOALS_KEY, merged.goals)
        saveToStorage(GOAL_STEPS_KEY, merged.steps)
      } catch (error) {
        if (cancelled) return
        setGoals(local.goals)
        setSteps(local.steps)
        setSyncError(
          error instanceof Error ? error.message : 'Could not sync goals.',
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

  const persistGoals = useCallback((next: Goal[]) => {
    setGoals(next)
    saveToStorage(GOALS_KEY, next)
  }, [])

  const persistSteps = useCallback((next: GoalStep[]) => {
    setSteps(next)
    saveToStorage(GOAL_STEPS_KEY, next)
  }, [])

  const addGoal = useCallback(
    async (input: Omit<Goal, 'id' | 'status'>) => {
      const goal: Goal = { ...input, id: generateId(), status: 'active' }
      const next = [goal, ...goals]
      persistGoals(next)

      if (!userId || !supabase) return
      const { error } = await supabase
        .from('goals')
        .insert(goalToInsert(goal, userId, 0))
      if (error) setSyncError(error.message)
    },
    [goals, persistGoals, userId],
  )

  const updateGoal = useCallback(
    async (id: string, updates: Partial<Omit<Goal, 'id'>>) => {
      const next = goals.map((g) => (g.id === id ? { ...g, ...updates } : g))
      if (updates.status === 'reached') hapticSuccess()
      persistGoals(next)

      if (!userId || !supabase) return
      const updated = next.find((g) => g.id === id)
      if (!updated) return
      const row = goalToInsert(
        updated,
        userId,
        next.findIndex((g) => g.id === id),
      )
      const { error } = await supabase.from('goals').update(row).eq('id', id)
      if (error) setSyncError(error.message)
    },
    [goals, persistGoals, userId],
  )

  const deleteGoal = useCallback(
    async (id: string) => {
      persistGoals(goals.filter((g) => g.id !== id))
      persistSteps(steps.filter((s) => s.goalId !== id))

      if (!userId || !supabase) return
      const { error } = await supabase.from('goals').delete().eq('id', id)
      if (error) setSyncError(error.message)
    },
    [goals, persistGoals, persistSteps, steps, userId],
  )

  const addStep = useCallback(
    async (goalId: string, title: string, date = formatDate(new Date())) => {
      const trimmed = title.trim()
      if (!trimmed) return

      hapticSuccess()
      const step: GoalStep = {
        id: generateId(),
        goalId,
        title: trimmed,
        date,
      }
      persistSteps([step, ...steps])

      if (!userId || !supabase) return
      const { error } = await supabase.from('goal_steps').insert({
        id: step.id,
        user_id: userId,
        goal_id: goalId,
        title: trimmed,
        logged_on: date,
      })
      if (error) setSyncError(error.message)
    },
    [persistSteps, steps, userId],
  )

  const deleteStep = useCallback(
    async (id: string) => {
      persistSteps(steps.filter((s) => s.id !== id))
      if (!userId || !supabase) return
      const { error } = await supabase.from('goal_steps').delete().eq('id', id)
      if (error) setSyncError(error.message)
    },
    [persistSteps, steps, userId],
  )

  return {
    goals,
    steps,
    ready,
    syncError,
    addGoal,
    updateGoal,
    deleteGoal,
    addStep,
    deleteStep,
  }
}
