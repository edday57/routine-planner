import type { Completion, Habit } from '../types'
import { completionFromRow, completionToInsert, habitFromRow, habitToInsert } from './mappers'
import { supabase } from './supabase'

export async function fetchRemoteRoutine(userId: string): Promise<{
  habits: Habit[]
  completions: Completion[]
}> {
  if (!supabase) return { habits: [], completions: [] }

  const [habitsRes, completionsRes] = await Promise.all([
    supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .order('sort_order', { ascending: true }),
    supabase.from('completions').select('*').eq('user_id', userId),
  ])

  if (habitsRes.error) throw habitsRes.error
  if (completionsRes.error) throw completionsRes.error

  return {
    habits: (habitsRes.data ?? []).map(habitFromRow),
    completions: (completionsRes.data ?? []).map(completionFromRow),
  }
}

export async function uploadLocalRoutine(
  userId: string,
  habits: Habit[],
  completions: Completion[],
): Promise<void> {
  if (!supabase) return

  if (habits.length > 0) {
    const habitRows = habits.map((habit, index) =>
      habitToInsert(habit, userId, index),
    )
    const { error: habitError } = await supabase.from('habits').upsert(habitRows)
    if (habitError) throw habitError
  }

  if (completions.length === 0) return

  const habitIds = new Set(habits.map((h) => h.id))
  const completionRows = completions
    .filter((c) => habitIds.has(c.habitId))
    .map((c) => completionToInsert(c, userId))

  if (completionRows.length === 0) return

  const { error: completionError } = await supabase
    .from('completions')
    .upsert(completionRows, { onConflict: 'user_id,habit_id,completed_on' })
  if (completionError) throw completionError
}
