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

export function isHabitDueOnDay(
  habit: Habit,
  date: Date,
  completions: Completion[],
  weekDates: Date[],
): boolean {
  switch (habit.type) {
    case 'daily':
      return true
    case 'scheduled':
      return habit.scheduledDays?.includes(date.getDay()) ?? false
    case 'weekly_target': {
      const count = getWeeklyCompletionCount(habit, completions, weekDates)
      return count < (habit.weeklyTarget ?? 1)
    }
  }
}

export const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

export const DAY_LABELS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const

export function formatDayName(date: Date): string {
  return DAY_LABELS[date.getDay()]
}

export function isSameDay(a: Date, b: Date): boolean {
  return formatDate(a) === formatDate(b)
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

export function canToggleOnDay(
  habit: Habit,
  date: Date,
  completions: Completion[],
  weekDates: Date[],
): boolean {
  if (!isHabitScheduledOnDay(habit, date)) return false

  if (habit.type === 'weekly_target') {
    const dateStr = formatDate(date)
    const alreadyDone = isCompletedOnDate(habit.id, dateStr, completions)
    if (alreadyDone) return true
    const count = getWeeklyCompletionCount(habit, completions, weekDates)
    return count < (habit.weeklyTarget ?? 1)
  }

  return true
}
