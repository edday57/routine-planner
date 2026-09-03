import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { Goal, GoalStep } from '../types'
import { GoalCard } from './GoalCard'
import { LogStepSheet } from './LogStepSheet'

interface GoalMomentumProps {
  goals: Goal[]
  steps: GoalStep[]
  onAddStep: (goalId: string, title: string) => void
  onSeeAll: () => void
}

export function GoalMomentum({
  goals,
  steps,
  onAddStep,
  onSeeAll,
}: GoalMomentumProps) {
  const [logging, setLogging] = useState<Goal | undefined>()
  const active = goals.filter((g) => g.status === 'active')

  if (active.length === 0) {
    return (
      <button
        type="button"
        onClick={onSeeAll}
        className="glass flex w-full items-center gap-3 rounded-4xl px-4 py-3.5 text-left transition active:scale-[0.99]"
      >
        <span className="glass-well grid size-10 place-items-center rounded-2xl text-xl">
          🧭
        </span>
        <span className="min-w-0">
          <span className="block text-[15px] font-semibold text-ink">
            Name something you want
          </span>
          <span className="block text-[13px] text-muted">
            Then log the tiny steps as they happen
          </span>
        </span>
      </button>
    )
  }

  const featured = [...active].sort((a, b) => {
    if (a.horizon !== b.horizon) return a.horizon === 'short' ? -1 : 1
    return 0
  })

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-faint">
          Toward your goals
        </h2>
        <button
          type="button"
          onClick={onSeeAll}
          className="text-[12px] font-semibold text-accent-ink"
        >
          All
        </button>
      </div>

      <div className="space-y-3">
        {featured.slice(0, 2).map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            steps={steps}
            compact
            onLog={() => setLogging(goal)}
            onQuickLog={(title) => onAddStep(goal.id, title)}
          />
        ))}
      </div>

      {active.length > 2 && (
        <button
          type="button"
          onClick={onSeeAll}
          className="flex w-full items-center justify-center gap-1.5 text-[13px] font-semibold text-muted"
        >
          <Plus className="size-3.5" />
          {active.length - 2} more
        </button>
      )}

      {logging && (
        <LogStepSheet
          goal={logging}
          steps={steps}
          onLog={(title) => onAddStep(logging.id, title)}
          onClose={() => setLogging(undefined)}
        />
      )}
    </section>
  )
}
