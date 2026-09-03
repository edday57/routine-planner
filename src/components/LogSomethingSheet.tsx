import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import type { Goal, GoalStep } from '../types'
import { LogStepSheet } from './LogStepSheet'
import { Sheet } from './Sheet'
import { goalMomentumCopy } from '../lib/goalProgress'

interface LogSomethingSheetProps {
  goals: Goal[]
  steps: GoalStep[]
  onLog: (goalId: string, title: string) => void
  onClose: () => void
}

export function LogSomethingSheet({
  goals,
  steps,
  onLog,
  onClose,
}: LogSomethingSheetProps) {
  const active = goals.filter((g) => g.status === 'active')
  const [picked, setPicked] = useState<Goal | undefined>(
    active.length === 1 ? active[0] : undefined,
  )

  if (picked) {
    return (
      <LogStepSheet
        goal={picked}
        steps={steps}
        onLog={(title) => onLog(picked.id, title)}
        onClose={onClose}
      />
    )
  }

  return (
    <Sheet title="What did you move toward?" onClose={onClose}>
      <div className="space-y-3 pb-2">
        <p className="text-[14px] leading-relaxed text-muted">
          Pick the goal, then tell us the step. Tiny is allowed.
        </p>
        {active.map((goal) => (
          <button
            key={goal.id}
            type="button"
            onClick={() => setPicked(goal)}
            className="glass flex w-full items-center gap-3.5 rounded-3xl px-4 py-3.5 text-left transition active:scale-[0.99]"
          >
            <span className="glass-well grid size-11 shrink-0 place-items-center rounded-2xl text-[1.35rem]">
              {goal.emoji ?? '🌱'}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[15px] font-semibold text-ink">
                {goal.title}
              </span>
              <span className="block text-[13px] text-muted">
                {goalMomentumCopy(goal, steps)}
              </span>
            </span>
            <ChevronRight className="size-4 shrink-0 text-faint" />
          </button>
        ))}
      </div>
    </Sheet>
  )
}
