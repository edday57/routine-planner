import type { Completion, Habit } from '../types'
import type { Database } from './database.types'

type HabitRow = Database['public']['Tables']['habits']['Row']
type HabitInsert = Database['public']['Tables']['habits']['Insert']
type CompletionRow = Database['public']['Tables']['completions']['Row']
type CompletionInsert = Database['public']['Tables']['completions']['Insert']

export function habitFromRow(row: HabitRow): Habit {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    scheduledDays: row.scheduled_days ?? undefined,
    weeklyTarget: row.weekly_target ?? undefined,
    timeLabel: row.time_label ?? undefined,
    emoji: row.emoji ?? undefined,
  }
}

export function habitToInsert(
  habit: Habit,
  userId: string,
  sortOrder: number,
): HabitInsert {
  return {
    id: habit.id,
    user_id: userId,
    name: habit.name,
    type: habit.type,
    scheduled_days: habit.scheduledDays ?? null,
    weekly_target: habit.weeklyTarget ?? null,
    time_label: habit.timeLabel ?? null,
    emoji: habit.emoji ?? null,
    sort_order: sortOrder,
    updated_at: new Date().toISOString(),
  }
}

export function completionFromRow(row: CompletionRow): Completion {
  return {
    habitId: row.habit_id,
    date: row.completed_on,
  }
}

export function completionToInsert(
  completion: Completion,
  userId: string,
): CompletionInsert {
  return {
    user_id: userId,
    habit_id: completion.habitId,
    completed_on: completion.date,
  }
}
