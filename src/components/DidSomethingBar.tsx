import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import type { Goal, GoalStep } from '../types'
import { formatDate } from '../lib/weekUtils'
import { LogSomethingSheet } from './LogSomethingSheet'

interface DidSomethingBarProps {
  goals: Goal[]
  steps: GoalStep[]
  onAddStep: (goalId: string, title: string) => void
}

export function DidSomethingBar({
  goals,
  steps,
  onAddStep,
}: DidSomethingBarProps) {
  const [open, setOpen] = useState(false)
  const active = goals.filter((g) => g.status === 'active')
  const winsToday = steps.filter((s) => s.date === formatDate(new Date())).length

  if (active.length === 0) return null

  return (
    <>
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="accent-fill flex w-full items-center justify-center gap-2 rounded-3xl py-3.5 text-[15px] font-semibold text-on-accent shadow-glow transition active:scale-[0.98]"
        >
          <Sparkles className="size-4" />
          I did something
        </button>
        {winsToday > 0 && (
          <p className="px-1 text-[13px] font-medium text-accent-ink">
            {winsToday === 1
              ? 'You already took a step today. That counts.'
              : `${winsToday} steps logged today. That’s momentum.`}
          </p>
        )}
      </div>

      {open && (
        <LogSomethingSheet
          goals={active}
          steps={steps}
          onLog={onAddStep}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
