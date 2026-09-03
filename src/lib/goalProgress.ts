import type { Goal, GoalStep } from '../types'
import { formatDate, getWeekDates } from './weekUtils'

export function stepsForGoal(goalId: string, steps: GoalStep[]): GoalStep[] {
  return steps
    .filter((step) => step.goalId === goalId)
    .sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? 1 : -1))
}

export function stepsThisWeek(goalId: string, steps: GoalStep[], today = new Date()): number {
  const week = new Set(getWeekDates(today).map(formatDate))
  return steps.filter((step) => step.goalId === goalId && week.has(step.date)).length
}

export function stepsToday(goalId: string, steps: GoalStep[], today = new Date()): number {
  const todayStr = formatDate(today)
  return steps.filter((step) => step.goalId === goalId && step.date === todayStr).length
}

export function goalPercent(goal: Goal, steps: GoalStep[]): number {
  if (!goal.targetSteps) return 0
  const count = stepsForGoal(goal.id, steps).length
  return Math.min(100, (count / goal.targetSteps) * 100)
}

export function recentStepTitles(goalId: string, steps: GoalStep[], limit = 3): string[] {
  const seen = new Set<string>()
  const titles: string[] = []
  for (const step of stepsForGoal(goalId, steps)) {
    const key = step.title.trim().toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    titles.push(step.title)
    if (titles.length >= limit) break
  }
  return titles
}

export function defaultStepChips(goal: Goal): string[] {
  if (goal.horizon === 'short') {
    return ['Did a bit', 'Showed up', 'Made a start']
  }
  return ['Took a step', 'Came back to it', 'Kept going']
}

export function winMessageForStep(title: string, goalTitle?: string): string {
  const short = title.trim()
  if (goalTitle) return `${short} — toward ${goalTitle}`
  return `${short}. That counts.`
}

export function goalMomentumCopy(goal: Goal, steps: GoalStep[]): string {
  const total = stepsForGoal(goal.id, steps).length
  const weekly = stepsThisWeek(goal.id, steps)

  if (goal.status === 'reached') {
    return 'You reached this — look at the path you built.'
  }
  if (total === 0) {
    return goal.horizon === 'short'
      ? 'One small move is enough to start.'
      : 'Big things grow from tiny repeats.'
  }
  if (weekly === 0) {
    return total === 1
      ? 'One step on the board. Another whenever you’re ready.'
      : `${total} steps so far. This week is a fresh page.`
  }
  if (goal.targetSteps) {
    const left = Math.max(0, goal.targetSteps - total)
    if (left === 0) return 'You’ve hit the count you set. Celebrate that.'
    return `${total} of ${goal.targetSteps} · ${weekly} this week`
  }
  const stepWord = total === 1 ? 'step' : 'steps'
  return weekly === 1
    ? `${total} ${stepWord} · one this week`
    : `${total} ${stepWord} · ${weekly} this week`
}
