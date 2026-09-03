import type { Completion, Goal, GoalStep, Habit } from '../types'

function habitFingerprint(habit: Habit): string {
  return [
    habit.name.trim().toLowerCase(),
    habit.type,
    habit.timeLabel?.trim().toLowerCase() ?? '',
    [...(habit.scheduledDays ?? [])].sort().join(','),
    habit.weeklyTarget ?? '',
  ].join('|')
}

/**
 * Combine two isolated copies of a routine (Safari vs the home-screen app)
 * without dropping either side's check-offs.
 *
 * Same habit id wins as one row. Habits that only exist locally but match a
 * remote habit by name + schedule are treated as the same row, and their
 * completions are remapped onto the remote id.
 */
export function mergeRoutines(
  local: { habits: Habit[]; completions: Completion[] },
  remote: { habits: Habit[]; completions: Completion[] },
): { habits: Habit[]; completions: Completion[] } {
  const habits = new Map<string, Habit>()
  const remap = new Map<string, string>()

  for (const habit of remote.habits) {
    habits.set(habit.id, habit)
  }

  const remoteByFingerprint = new Map(
    remote.habits.map((habit) => [habitFingerprint(habit), habit]),
  )

  for (const habit of local.habits) {
    if (habits.has(habit.id)) continue

    const match = remoteByFingerprint.get(habitFingerprint(habit))
    if (match) {
      remap.set(habit.id, match.id)
      continue
    }

    habits.set(habit.id, habit)
  }

  const completions = new Map<string, Completion>()

  const addCompletion = (completion: Completion) => {
    const habitId = remap.get(completion.habitId) ?? completion.habitId
    if (!habits.has(habitId)) return
    completions.set(`${habitId}|${completion.date}`, {
      habitId,
      date: completion.date,
    })
  }

  remote.completions.forEach(addCompletion)
  local.completions.forEach(addCompletion)

  return {
    habits: [...habits.values()],
    completions: [...completions.values()],
  }
}

function goalFingerprint(goal: Goal): string {
  return [goal.title.trim().toLowerCase(), goal.horizon].join('|')
}

export function mergeGoals(
  local: { goals: Goal[]; steps: GoalStep[] },
  remote: { goals: Goal[]; steps: GoalStep[] },
): { goals: Goal[]; steps: GoalStep[] } {
  const goals = new Map<string, Goal>()
  const remap = new Map<string, string>()

  for (const goal of remote.goals) {
    goals.set(goal.id, goal)
  }

  const remoteByFingerprint = new Map(
    remote.goals.map((goal) => [goalFingerprint(goal), goal]),
  )

  for (const goal of local.goals) {
    if (goals.has(goal.id)) {
      const remoteGoal = goals.get(goal.id)
      if (remoteGoal && goal.status === 'reached') {
        goals.set(goal.id, { ...remoteGoal, status: 'reached' })
      }
      continue
    }

    const match = remoteByFingerprint.get(goalFingerprint(goal))
    if (match) {
      remap.set(goal.id, match.id)
      continue
    }

    goals.set(goal.id, goal)
  }

  const steps = new Map<string, GoalStep>()

  const addStep = (step: GoalStep) => {
    const goalId = remap.get(step.goalId) ?? step.goalId
    if (!goals.has(goalId)) return
    steps.set(step.id, { ...step, goalId })
  }

  remote.steps.forEach(addStep)
  local.steps.forEach(addStep)

  return {
    goals: [...goals.values()],
    steps: [...steps.values()],
  }
}
