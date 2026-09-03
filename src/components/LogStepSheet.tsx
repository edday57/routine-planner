import { useState } from 'react'
import type { Goal, GoalStep } from '../types'
import { defaultStepChips, recentStepTitles } from '../lib/goalProgress'
import { Sheet } from './Sheet'

interface LogStepSheetProps {
  goal: Goal
  steps: GoalStep[]
  onLog: (title: string) => void
  onClose: () => void
}

export function LogStepSheet({ goal, steps, onLog, onClose }: LogStepSheetProps) {
  const [custom, setCustom] = useState('')
  const chips = [
    ...recentStepTitles(goal.id, steps),
    ...defaultStepChips(goal).filter(
      (chip) =>
        !recentStepTitles(goal.id, steps).some(
          (title) => title.toLowerCase() === chip.toLowerCase(),
        ),
    ),
  ].slice(0, 5)

  const log = (title: string) => {
    const trimmed = title.trim()
    if (!trimmed) return
    onLog(trimmed)
    onClose()
  }

  return (
    <Sheet title="What did you do?" onClose={onClose}>
      <div className="space-y-5 pb-2">
        <p className="text-[14px] leading-relaxed text-muted">
          Toward <span className="font-semibold text-ink">{goal.emoji} {goal.title}</span>.
          Anything counts — packing a bag, five minutes, showing up.
        </p>

        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => log(chip)}
              className="glass rounded-full px-4 py-2.5 text-[14px] font-semibold text-ink transition active:scale-95"
            >
              {chip}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            log(custom)
          }}
          className="space-y-3"
        >
          <label className="block">
            <span className="mb-2.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-faint">
              Or write it in your words
            </span>
            <input
              type="text"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="Went for a ten-minute walk"
              className="glass-well w-full rounded-2xl px-4 py-3.5 text-[16px] text-ink outline-none transition placeholder:text-faint focus:border-accent-hi"
              autoFocus
            />
          </label>
          <button
            type="submit"
            disabled={!custom.trim()}
            className="accent-fill w-full rounded-2xl py-3.5 text-[15px] font-semibold text-on-accent shadow-glow transition active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
          >
            Add this step
          </button>
        </form>
      </div>
    </Sheet>
  )
}
