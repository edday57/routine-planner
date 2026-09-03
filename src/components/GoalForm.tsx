import { useState } from 'react'
import { ChevronRight, Minus, Plus, Trash2 } from 'lucide-react'
import type { Goal, GoalHorizon } from '../types'
import { Sheet } from './Sheet'

const EMOJI_OPTIONS = [
  '🌱', '🎯', '💪', '📚', '🎨', '🏠', '💼', '💛',
  '🧠', '🌙', '🏃', '✍️', '🎵', '🌿', '✨', '🧭',
]

const HORIZON_OPTIONS: {
  id: GoalHorizon
  label: string
  description: string
}[] = [
  {
    id: 'short',
    label: 'Soon',
    description: 'This week or month — close enough to feel',
  },
  {
    id: 'long',
    label: 'Further out',
    description: 'A direction you want your days to add up to',
  },
]

function FieldLabel({ children }: { children: string }) {
  return (
    <span className="mb-2.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-faint">
      {children}
    </span>
  )
}

const inputClass =
  'glass-well w-full rounded-2xl px-4 py-3.5 text-[16px] text-ink outline-none transition placeholder:text-faint focus:border-accent-hi'

interface GoalFormProps {
  goal?: Goal
  onSave: (data: Omit<Goal, 'id' | 'status'>) => void
  onCancel: () => void
  onDelete?: () => void
  onMarkReached?: () => void
  onReopen?: () => void
}

export function GoalForm({
  goal,
  onSave,
  onCancel,
  onDelete,
  onMarkReached,
  onReopen,
}: GoalFormProps) {
  const [title, setTitle] = useState(goal?.title ?? '')
  const [why, setWhy] = useState(goal?.why ?? '')
  const [horizon, setHorizon] = useState<GoalHorizon>(goal?.horizon ?? 'short')
  const [emoji, setEmoji] = useState(goal?.emoji ?? '🌱')
  const [hasTarget, setHasTarget] = useState(Boolean(goal?.targetSteps))
  const [targetSteps, setTargetSteps] = useState(goal?.targetSteps ?? 8)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const canSave = title.trim().length > 0

  const handleSubmit = () => {
    if (!canSave) return
    onSave({
      title: title.trim(),
      why: why.trim() || undefined,
      horizon,
      emoji,
      targetSteps: hasTarget ? targetSteps : undefined,
    })
  }

  return (
    <Sheet
      title={goal ? 'Edit goal' : 'New goal'}
      onClose={onCancel}
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="glass-well flex-1 rounded-2xl py-3.5 text-[15px] font-semibold text-muted transition active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSave}
            className="accent-fill flex-[1.4] rounded-2xl py-3.5 text-[15px] font-semibold text-on-accent shadow-glow transition active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
          >
            {goal ? 'Save' : 'Start this'}
          </button>
        </div>
      }
    >
      <div className="space-y-6 pb-2">
        <label className="block">
          <FieldLabel>What do you want?</FieldLabel>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Feel like mornings are mine again"
            className={inputClass}
            autoFocus
          />
        </label>

        <div>
          <FieldLabel>Horizon</FieldLabel>
          <div className="space-y-2">
            {HORIZON_OPTIONS.map((option) => {
              const active = horizon === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setHorizon(option.id)}
                  aria-pressed={active}
                  className={`flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-left transition active:scale-[0.99] ${
                    active
                      ? 'bg-accent-wash ring-2 ring-accent-hi'
                      : 'glass-well hover:text-ink'
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block text-[15px] font-semibold text-ink">
                      {option.label}
                    </span>
                    <span className="block text-[13px] text-muted">
                      {option.description}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <label className="block">
          <FieldLabel>Why it matters (optional)</FieldLabel>
          <input
            type="text"
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            placeholder="So I remember I can follow through"
            className={inputClass}
          />
        </label>

        <div>
          <FieldLabel>Icon</FieldLabel>
          <div className="grid grid-cols-8 gap-1.5">
            {EMOJI_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setEmoji(option)}
                aria-pressed={emoji === option}
                className={`grid aspect-square place-items-center rounded-xl text-lg transition active:scale-90 ${
                  emoji === option
                    ? 'bg-accent-wash ring-2 ring-accent-hi'
                    : 'glass-well hover:bg-accent-wash'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setHasTarget((v) => !v)}
            className={`flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left transition ${
              hasTarget ? 'bg-accent-wash ring-2 ring-accent-hi' : 'glass-well'
            }`}
          >
            <span>
              <span className="block text-[15px] font-semibold text-ink">
                Give it a count
              </span>
              <span className="block text-[13px] text-muted">
                Optional. Skip this if a number would feel like pressure.
              </span>
            </span>
          </button>

          {hasTarget && (
            <div className="glass-well mt-2 flex items-center gap-4 rounded-2xl p-2.5">
              <button
                type="button"
                onClick={() => setTargetSteps((v) => Math.max(1, v - 1))}
                aria-label="Decrease target"
                className="glass grid size-11 place-items-center rounded-xl text-ink transition active:scale-90"
              >
                <Minus className="size-4" />
              </button>
              <span className="flex-1 text-center">
                <span className="block text-2xl font-bold tabular-nums text-ink">
                  {targetSteps}
                </span>
                <span className="text-[12px] text-muted">steps</span>
              </span>
              <button
                type="button"
                onClick={() => setTargetSteps((v) => Math.min(365, v + 1))}
                aria-label="Increase target"
                className="glass grid size-11 place-items-center rounded-xl text-ink transition active:scale-90"
              >
                <Plus className="size-4" />
              </button>
            </div>
          )}
        </div>

        {goal && onMarkReached && goal.status === 'active' && (
          <button
            type="button"
            onClick={onMarkReached}
            className="flex w-full items-center justify-center rounded-2xl bg-accent-wash px-4 py-3.5 text-[15px] font-semibold text-accent-ink transition active:scale-[0.99]"
          >
            I reached this
          </button>
        )}

        {goal && onReopen && goal.status === 'reached' && (
          <button
            type="button"
            onClick={onReopen}
            className="flex w-full items-center justify-center rounded-2xl bg-accent-wash px-4 py-3.5 text-[15px] font-semibold text-accent-ink transition active:scale-[0.99]"
          >
            Keep going with this
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            onClick={() => {
              if (confirmDelete) onDelete()
              else setConfirmDelete(true)
            }}
            className={`flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-[15px] font-semibold transition active:scale-[0.99] ${
              confirmDelete
                ? 'bg-rose/12 text-rose ring-2 ring-rose/50'
                : 'glass-well text-muted hover:text-rose'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Trash2 className="size-4" />
              {confirmDelete ? 'Tap again to delete' : 'Delete goal'}
            </span>
            <ChevronRight className="size-4 opacity-50" />
          </button>
        )}
      </div>
    </Sheet>
  )
}
