import type { Completion, Goal, GoalStep, Habit } from '../types'
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

type GoalRow = Database['public']['Tables']['goals']['Row']
type GoalInsert = Database['public']['Tables']['goals']['Insert']
type GoalStepRow = Database['public']['Tables']['goal_steps']['Row']
type GoalStepInsert = Database['public']['Tables']['goal_steps']['Insert']

export function goalFromRow(row: GoalRow): Goal {
  return {
    id: row.id,
    title: row.title,
    why: row.why ?? undefined,
    horizon: row.horizon,
    emoji: row.emoji ?? undefined,
    targetSteps: row.target_steps ?? undefined,
    status: row.status,
  }
}

export function goalToInsert(
  goal: Goal,
  userId: string,
  sortOrder: number,
): GoalInsert {
  return {
    id: goal.id,
    user_id: userId,
    title: goal.title,
    why: goal.why ?? null,
    horizon: goal.horizon,
    emoji: goal.emoji ?? null,
    target_steps: goal.targetSteps ?? null,
    status: goal.status,
    sort_order: sortOrder,
    updated_at: new Date().toISOString(),
  }
}

export function goalStepFromRow(row: GoalStepRow): GoalStep {
  return {
    id: row.id,
    goalId: row.goal_id,
    title: row.title,
    date: row.logged_on,
  }
}

export function goalStepToInsert(
  step: GoalStep,
  userId: string,
): GoalStepInsert {
  return {
    id: step.id,
    user_id: userId,
    goal_id: step.goalId,
    title: step.title,
    logged_on: step.date,
  }
}
