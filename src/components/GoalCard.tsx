import { Plus } from 'lucide-react'
import type { Goal, GoalStep } from '../types'
import {
  defaultStepChips,
  goalMomentumCopy,
  goalPercent,
  stepsForGoal,
  stepsThisWeek,
} from '../lib/goalProgress'
import { formatDate } from '../lib/weekUtils'

interface GoalCardProps {
  goal: Goal
  steps: GoalStep[]
  onLog: () => void
  onQuickLog?: (title: string) => void
  onEdit?: () => void
  compact?: boolean
}

export function GoalCard({
  goal,
  steps,
  onLog,
  onQuickLog,
  onEdit,
  compact = false,
}: GoalCardProps) {
  const all = stepsForGoal(goal.id, steps)
  const weekly = stepsThisWeek(goal.id, steps)
  const percent = goalPercent(goal, steps)
  const latest = all[0]
  const reached = goal.status === 'reached'
  const quickTitle = defaultStepChips(goal)[1] ?? 'Showed up'
  const trail = all.slice(0, compact ? 0 : 3)

  return (
    <article
      className={`animate-rise rounded-4xl px-4 py-4 ${
        reached ? 'glass-tint' : 'glass'
      }`}
    >
      <button
        type="button"
        onClick={onEdit}
        disabled={!onEdit}
        className="flex w-full items-start gap-3 text-left disabled:pointer-events-none"
      >
        <span className="glass-well grid size-11 shrink-0 place-items-center rounded-2xl text-[1.35rem]">
          {goal.emoji ?? '🌱'}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="truncate text-[16px] font-semibold tracking-[-0.015em] text-ink">
              {goal.title}
            </span>
            <span className="shrink-0 rounded-md bg-accent-wash px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-ink">
              {goal.horizon === 'short' ? 'Soon' : 'Further'}
            </span>
          </span>
          {goal.why && !compact && (
            <span className="mt-0.5 block text-[13px] text-muted">{goal.why}</span>
          )}
          <span className="mt-1 block text-[13px] text-accent-ink">
            {goalMomentumCopy(goal, steps)}
          </span>
        </span>
      </button>

      {goal.targetSteps ? (
        <div className="mt-3.5">
          <div className="mb-1.5 flex justify-between text-[11px] font-semibold text-faint">
            <span>
              {all.length}/{goal.targetSteps}
            </span>
            {weekly > 0 && <span>{weekly} this week</span>}
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-line-strong/40">
            <div
              className="accent-fill h-full rounded-full transition-[width] duration-700 ease-spring"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="mt-3 flex gap-1">
          {Array.from({ length: 7 }, (_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i < Math.min(7, weekly) ? 'accent-fill' : 'bg-line-strong/40'
              }`}
            />
          ))}
        </div>
      )}

      {trail.length > 0 && (
        <ol className="mt-3 space-y-1.5">
          {trail.map((step) => (
            <li
              key={step.id}
              className="flex items-baseline justify-between gap-3 text-[13px]"
            >
              <span className="min-w-0 truncate font-medium text-ink">
                {step.title}
              </span>
              <span className="shrink-0 text-[11px] font-semibold text-faint">
                {formatStepDay(step.date)}
              </span>
            </li>
          ))}
        </ol>
      )}

      {latest && compact && (
        <p className="mt-3 text-[13px] text-muted">
          Latest: <span className="font-medium text-ink">{latest.title}</span>
        </p>
      )}

      {!reached && goal.targetSteps && all.length >= goal.targetSteps && (
        <p className="mt-3 text-[13px] font-medium text-accent-ink">
          You hit the count you set. Mark it reached whenever it feels true.
        </p>
      )}

      {!reached && (
        <div className="mt-3.5 flex gap-2">
          {onQuickLog ? (
            <>
              <button
                type="button"
                onClick={() => onQuickLog(quickTitle)}
                className="accent-fill flex flex-[1.4] items-center justify-center gap-2 rounded-2xl py-3 text-[14px] font-semibold text-on-accent shadow-glow transition active:scale-[0.98]"
              >
                {quickTitle}
              </button>
              <button
                type="button"
                onClick={onLog}
                className="glass-well flex flex-1 items-center justify-center gap-1.5 rounded-2xl py-3 text-[14px] font-semibold text-accent-ink transition active:scale-[0.98]"
              >
                <Plus className="size-4" strokeWidth={2.5} />
                Other
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onLog}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent-wash py-3 text-[14px] font-semibold text-accent-ink transition active:scale-[0.98]"
            >
              <Plus className="size-4" strokeWidth={2.5} />
              I did something
            </button>
          )}
        </div>
      )}
    </article>
  )
}

function formatStepDay(iso: string): string {
  if (iso === formatDate(new Date())) return 'Today'
  const date = new Date(`${iso}T12:00:00`)
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })
}
