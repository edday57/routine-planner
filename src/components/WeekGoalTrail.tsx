import type { Goal, GoalStep } from '../types'
import { formatDate, getWeekDates } from '../lib/weekUtils'

interface WeekGoalTrailProps {
  goals: Goal[]
  steps: GoalStep[]
  weekAnchor: Date
}

export function WeekGoalTrail({ goals, steps, weekAnchor }: WeekGoalTrailProps) {
  const week = new Set(getWeekDates(weekAnchor).map(formatDate))
  const weekSteps = steps
    .filter((step) => week.has(step.date))
    .sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? 1 : -1))

  const active = goals.filter((goal) => goal.status === 'active')

  if (weekSteps.length === 0) {
    if (active.length === 0) return null
    return (
      <section className="glass rounded-4xl p-4">
        <h2 className="mb-1 px-1 text-[11px] font-bold uppercase tracking-[0.16em] text-faint">
          Toward your goals
        </h2>
        <p className="px-1 text-[14px] leading-relaxed text-muted">
          Nothing logged this week yet. A tiny step still counts.
        </p>
      </section>
    )
  }

  const byId = new Map(goals.map((goal) => [goal.id, goal]))

  return (
    <section className="glass rounded-4xl p-4">
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-faint">
          Toward your goals
        </h2>
        <span className="text-[11px] font-bold tabular-nums text-faint">
          {weekSteps.length}
        </span>
      </div>
      <ul className="space-y-2.5">
        {weekSteps.slice(0, 8).map((step) => {
          const goal = byId.get(step.goalId)
          return (
            <li key={step.id} className="flex items-start gap-3">
              <span className="glass-well grid size-9 shrink-0 place-items-center rounded-xl text-base">
                {goal?.emoji ?? '🌱'}
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] font-semibold text-ink">
                  {step.title}
                </span>
                <span className="block text-[12px] text-muted">
                  Toward {goal?.title ?? 'a goal'}
                </span>
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
