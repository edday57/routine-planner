import type { Completion, Habit } from '../types'
import {
  formatDate,
  getWeeklyCompletionCount,
  isCompletedOnDate,
  isHabitDueOnDay,
  isHabitScheduledOnDay,
} from './weekUtils'

export interface TodayProgress {
  total: number
  completed: number
  percent: number
}

export interface HabitWeekProgress {
  completed: number
  total: number
  percent: number
}

export function getTodayProgress(
  habits: Habit[],
  completions: Completion[],
  today: Date = new Date(),
): TodayProgress {
  const weekDates = getWeekDatesFromAnchor(today)
  const todayStr = formatDate(today)
  const dueToday = habits.filter((h) =>
    isHabitDueOnDay(h, today, completions, weekDates),
  )
  const completedToday = dueToday.filter((h) =>
    isCompletedOnDate(h.id, todayStr, completions),
  )

  return {
    total: dueToday.length,
    completed: completedToday.length,
    percent:
      dueToday.length === 0
        ? 0
        : (completedToday.length / dueToday.length) * 100,
  }
}

function getWeekDatesFromAnchor(date: Date): Date[] {
  const day = date.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  const monday = new Date(date)
  monday.setDate(date.getDate() + diffToMonday)
  monday.setHours(0, 0, 0, 0)

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

export function getHabitWeekProgress(
  habit: Habit,
  completions: Completion[],
  weekDates: Date[],
): HabitWeekProgress {
  if (habit.type === 'weekly_target') {
    const completed = getWeeklyCompletionCount(habit, completions, weekDates)
    const total = habit.weeklyTarget ?? 1
    return {
      completed,
      total,
      percent: Math.min(100, (completed / total) * 100),
    }
  }

  const dueDays = weekDates.filter((d) => isHabitScheduledOnDay(habit, d))
  const completed = dueDays.filter((d) =>
    isCompletedOnDate(habit.id, formatDate(d), completions),
  ).length

  return {
    completed,
    total: dueDays.length,
    percent: dueDays.length === 0 ? 0 : (completed / dueDays.length) * 100,
  }
}

export function getWeekSummary(
  habits: Habit[],
  completions: Completion[],
  weekDates: Date[],
): { habit: Habit; progress: HabitWeekProgress }[] {
  return habits.map((habit) => ({
    habit,
    progress: getHabitWeekProgress(habit, completions, weekDates),
  }))
}
