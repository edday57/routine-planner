import type { Completion } from '../types'
import { formatDate } from './weekUtils'

const MAX_LOOKBACK_DAYS = 400

/**
 * Consecutive days you showed up, counting any day with at least one
 * completion. Today not being ticked yet does not break the streak.
 */
export function getShowUpStreak(
  completions: Completion[],
  today: Date = new Date(),
): number {
  if (completions.length === 0) return 0

  const days = new Set(completions.map((c) => c.date))
  const cursor = new Date(today)
  cursor.setHours(0, 0, 0, 0)

  if (!days.has(formatDate(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
  }

  let streak = 0
  for (let i = 0; i < MAX_LOOKBACK_DAYS; i += 1) {
    if (!days.has(formatDate(cursor))) break
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}
