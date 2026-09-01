import type { Completion, Habit } from '../types'
import {
  formatDate,
  getWeekDates,
  getWeeklyCompletionCount,
  isCompletedOnDate,
  isHabitDueOnDay,
  isHabitScheduledOnDay,
} from './weekUtils'

export interface Progress {
  completed: number
  total: number
  percent: number
}

function toProgress(completed: number, total: number): Progress {
  return {
    completed,
    total,
    percent: total === 0 ? 0 : Math.min(100, (completed / total) * 100),
  }
}

export function getTodayProgress(
  habits: Habit[],
  completions: Completion[],
  today: Date = new Date(),
): Progress {
  const weekDates = getWeekDates(today)
  const todayStr = formatDate(today)
  const due = habits.filter((h) =>
    isHabitDueOnDay(h, today, completions, weekDates),
  )
  const done = due.filter((h) => isCompletedOnDate(h.id, todayStr, completions))
  return toProgress(done.length, due.length)
}

export function getHabitWeekProgress(
  habit: Habit,
  completions: Completion[],
  weekDates: Date[],
): Progress {
  if (habit.type === 'weekly_target') {
    return toProgress(
      getWeeklyCompletionCount(habit, completions, weekDates),
      habit.weeklyTarget ?? 1,
    )
  }

  const dueDays = weekDates.filter((d) => isHabitScheduledOnDay(habit, d))
  const done = dueDays.filter((d) =>
    isCompletedOnDate(habit.id, formatDate(d), completions),
  ).length
  return toProgress(done, dueDays.length)
}

export function getWeekSummary(
  habits: Habit[],
  completions: Completion[],
  weekDates: Date[],
): { habit: Habit; progress: Progress }[] {
  return habits.map((habit) => ({
    habit,
    progress: getHabitWeekProgress(habit, completions, weekDates),
  }))
}

export function getWeekOverview(
  habits: Habit[],
  completions: Completion[],
  weekDates: Date[],
): Progress {
  return getWeekSummary(habits, completions, weekDates).reduce(
    (acc, { progress }) =>
      toProgress(
        acc.completed + progress.completed,
        acc.total + progress.total,
      ),
    toProgress(0, 0),
  )
}

/**
 * How a single day went: completions counted against the fixed habits
 * scheduled that day. Weekly-target ticks count towards the day's total too.
 */
export function getDayStats(
  habits: Habit[],
  completions: Completion[],
  date: Date,
): Progress {
  const dateStr = formatDate(date)
  const scheduled = habits.filter(
    (h) => h.type !== 'weekly_target' && isHabitScheduledOnDay(h, date),
  )
  const completedIds = new Set(
    completions.filter((c) => c.date === dateStr).map((c) => c.habitId),
  )
  const done = habits.filter((h) => completedIds.has(h.id)).length
  const total = Math.max(scheduled.length, done)
  return toProgress(done, total)
}
