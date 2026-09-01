import { useState } from 'react'
import { Minus, Plus, Trash2, X } from 'lucide-react'
import type { Habit, HabitType } from '../types'
import { DAY_LABELS } from '../lib/weekUtils'

const EMOJI_OPTIONS = ['☀️', '🏋️', '🧘', '📖', '💧', '🚶', '🍎', '🛏️', '✍️', '🎵', '💊', '🧹']

interface HabitFormProps {
  habit?: Habit
  onSave: (data: Omit<Habit, 'id'>) => void
  onCancel: () => void
}

const TYPE_OPTIONS: {
  id: HabitType
  label: string
  description: string
}[] = [
  { id: 'daily', label: 'Every day', description: 'Same habit, every day' },
  { id: 'scheduled', label: 'Specific days', description: 'Pick which days' },
  { id: 'weekly_target', label: 'Weekly target', description: 'Any days, set a count' },
]

export function HabitForm({ habit, onSave, onCancel }: HabitFormProps) {
  const [name, setName] = useState(habit?.name ?? '')
  const [type, setType] = useState<HabitType>(habit?.type ?? 'daily')
  const [emoji, setEmoji] = useState(habit?.emoji ?? '✓')
  const [timeLabel, setTimeLabel] = useState(habit?.timeLabel ?? '')
  const [scheduledDays, setScheduledDays] = useState<number[]>(
    habit?.scheduledDays ?? [1, 3, 5],
  )
  const [weeklyTarget, setWeeklyTarget] = useState(habit?.weeklyTarget ?? 5)

  const toggleDay = (day: number) => {
    setScheduledDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort(),
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onSave({
      name: name.trim(),
      type,
      emoji,
      timeLabel: timeLabel.trim() || undefined,
      scheduledDays: type === 'scheduled' ? scheduledDays : undefined,
      weeklyTarget: type === 'weekly_target' ? weeklyTarget : undefined,
    })
  }

  return (
    <div
      className="sheet-backdrop fixed inset-0 z-50 flex items-end justify-center bg-stone-900/40 backdrop-blur-sm sm:items-center"
      onClick={onCancel}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="sheet-panel max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 pb-8 shadow-2xl sm:rounded-3xl"
      >
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-cream-dark sm:hidden" />

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-800">
            {habit ? 'Edit habit' : 'New habit'}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full p-2 text-warm-gray hover:bg-cream"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <label className="mb-5 block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-warm-gray-light">
            Name
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Gym, Wake up, Read"
            className="w-full rounded-2xl border border-cream-dark bg-cream px-4 py-3.5 text-base outline-none transition focus:border-sage focus:ring-4 focus:ring-sage/15"
            autoFocus
          />
        </label>

        <div className="mb-5">
          <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-warm-gray-light">
            Icon
          </span>
          <div className="flex flex-wrap gap-2">
            {EMOJI_OPTIONS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl transition-all active:scale-95 ${
                  emoji === e
                    ? 'bg-sage/15 ring-2 ring-sage shadow-sm'
                    : 'bg-cream hover:bg-cream-dark'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <label className="mb-5 block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-warm-gray-light">
            Time label (optional)
          </span>
          <input
            type="text"
            value={timeLabel}
            onChange={(e) => setTimeLabel(e.target.value)}
            placeholder="e.g. 8:00 AM"
            className="w-full rounded-2xl border border-cream-dark bg-cream px-4 py-3.5 text-base outline-none transition focus:border-sage focus:ring-4 focus:ring-sage/15"
          />
        </label>

        <div className="mb-5">
          <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-warm-gray-light">
            Schedule
          </span>
          <div className="space-y-2">
            {TYPE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setType(option.id)}
                className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all active:scale-[0.99] ${
                  type === option.id
                    ? 'border-sage bg-sage-muted shadow-sm'
                    : 'border-cream-dark bg-cream hover:border-sage/30'
                }`}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    type === option.id ? 'border-sage bg-sage' : 'border-cream-dark'
                  }`}
                >
                  {type === option.id && (
                    <span className="h-2 w-2 rounded-full bg-white" />
                  )}
                </span>
                <span>
                  <span className="block font-semibold text-stone-800">
                    {option.label}
                  </span>
                  <span className="block text-sm text-warm-gray-light">
                    {option.description}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {type === 'scheduled' && (
          <div className="mb-5">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-warm-gray-light">
              Days
            </span>
            <div className="flex gap-1.5">
              {DAY_LABELS.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleDay(i)}
                  className={`flex h-11 flex-1 items-center justify-center rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                    scheduledDays.includes(i)
                      ? 'bg-sage text-white shadow-sm'
                      : 'bg-cream text-warm-gray hover:bg-cream-dark'
                  }`}
                >
                  {label.slice(0, 1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {type === 'weekly_target' && (
          <div className="mb-5">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-warm-gray-light">
              Times per week
            </span>
            <div className="flex items-center gap-4 rounded-2xl border border-cream-dark bg-cream px-4 py-3">
              <button
                type="button"
                onClick={() => setWeeklyTarget((v) => Math.max(1, v - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm active:scale-95"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="flex-1 text-center text-2xl font-bold tabular-nums text-stone-800">
                {weeklyTarget}
              </span>
              <button
                type="button"
                onClick={() => setWeeklyTarget((v) => Math.min(7, v + 1))}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm active:scale-95"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-2xl border border-cream-dark py-3.5 font-semibold text-warm-gray active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim()}
            className="flex-1 rounded-2xl bg-sage py-3.5 font-semibold text-white shadow-[0_4px_12px_rgba(90,138,122,0.35)] disabled:opacity-50 active:scale-[0.98]"
          >
            Save habit
          </button>
        </div>
      </form>
    </div>
  )
}

interface HabitListItemProps {
  habit: Habit
  onEdit: () => void
  onDelete: () => void
}

const TYPE_BADGE: Record<HabitType, string> = {
  daily: 'Daily',
  scheduled: 'Scheduled',
  weekly_target: 'Weekly',
}

export function HabitListItem({ habit, onEdit, onDelete }: HabitListItemProps) {
  const scheduleLabel =
    habit.type === 'daily'
      ? 'Every day'
      : habit.type === 'scheduled'
        ? `${habit.scheduledDays?.map((d) => DAY_LABELS[d]).join(', ') ?? ''}`
        : `${habit.weeklyTarget}x per week`

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white px-4 py-3.5 shadow-[0_2px_12px_rgba(45,42,38,0.06)]">
      <button
        type="button"
        onClick={onEdit}
        className="flex min-w-0 flex-1 items-center gap-3 text-left active:opacity-80"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sage-muted text-2xl">
          {habit.emoji ?? '✓'}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate font-semibold text-stone-800">{habit.name}</p>
            <span className="shrink-0 rounded-md bg-cream-dark px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-warm-gray">
              {TYPE_BADGE[habit.type]}
            </span>
          </div>
          <p className="truncate text-sm text-warm-gray-light">
            {scheduleLabel}
            {habit.timeLabel ? ` · ${habit.timeLabel}` : ''}
          </p>
        </div>
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="rounded-xl p-2.5 text-warm-gray-light transition hover:bg-red-50 hover:text-red-500 active:scale-95"
        aria-label={`Delete ${habit.name}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}
