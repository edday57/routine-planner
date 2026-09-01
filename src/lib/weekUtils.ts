import type { Completion, Habit } from '../types'

export function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function getWeekDates(anchorDate: Date = new Date()): Date[] {
  const date = new Date(anchorDate)
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

export function getWeeklyCompletionCount(
  habit: Habit,
  completions: Completion[],
  weekDates: Date[],
): number {
  const weekDateStrings = new Set(weekDates.map(formatDate))
  return completions.filter(
    (c) => c.habitId === habit.id && weekDateStrings.has(c.date),
  ).length
}

export function isCompletedOnDate(
  habitId: string,
  date: string,
  completions: Completion[],
): boolean {
  return completions.some((c) => c.habitId === habitId && c.date === date)
}

export function isHabitScheduledOnDay(habit: Habit, date: Date): boolean {
  switch (habit.type) {
    case 'daily':
      return true
    case 'scheduled':
      return habit.scheduledDays?.includes(date.getDay()) ?? false
    case 'weekly_target':
      return true
  }
}

export function isHabitDueOnDay(
  habit: Habit,
  date: Date,
  completions: Completion[],
  weekDates: Date[],
): boolean {
  if (habit.type !== 'weekly_target') {
    return isHabitScheduledOnDay(habit, date)
  }

  // A met weekly target still belongs on the day it was ticked, so the habit
  // does not vanish from the list the moment the target is reached.
  if (isCompletedOnDate(habit.id, formatDate(date), completions)) return true
  return getWeeklyCompletionCount(habit, completions, weekDates) <
    (habit.weeklyTarget ?? 1)
}

export function canToggleOnDay(
  habit: Habit,
  date: Date,
  completions: Completion[],
  weekDates: Date[],
): boolean {
  if (!isHabitScheduledOnDay(habit, date)) return false

  if (habit.type === 'weekly_target') {
    const dateStr = formatDate(date)
    if (isCompletedOnDate(habit.id, dateStr, completions)) return true
    return getWeeklyCompletionCount(habit, completions, weekDates) <
      (habit.weeklyTarget ?? 1)
  }

  return true
}

export const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

/** Day-of-week indexes ordered Monday first, matching the week views. */
export const WEEK_DAY_ORDER = [1, 2, 3, 4, 5, 6, 0] as const

export function formatDayName(date: Date): string {
  return DAY_LABELS[date.getDay()]
}

export function formatDayFull(date: Date): string {
  return date.toLocaleDateString('en-GB', { weekday: 'long' })
}

export function isSameDay(a: Date, b: Date): boolean {
  return formatDate(a) === formatDate(b)
}

export function describeSchedule(habit: Habit): string {
  switch (habit.type) {
    case 'daily':
      return 'Every day'
    case 'scheduled': {
      const days = habit.scheduledDays ?? []
      if (days.length === 0) return 'No days picked'
      if (days.length === 7) return 'Every day'
      return WEEK_DAY_ORDER.filter((d) => days.includes(d))
        .map((d) => DAY_LABELS[d])
        .join(' · ')
    }
    case 'weekly_target':
      return `${habit.weeklyTarget ?? 1}x per week`
  }
}
