import { useState } from 'react'
import { ChevronRight, Minus, Plus, Trash2 } from 'lucide-react'
import type { Habit, HabitType } from '../types'
import { DAY_LABELS, WEEK_DAY_ORDER, describeSchedule } from '../lib/weekUtils'
import { Sheet } from './Sheet'

const EMOJI_OPTIONS = [
  '☀️', '🏋️', '🧘', '📖', '💧', '🚶', '🍎', '🛏️',
  '✍️', '🎵', '💊', '🧹', '🏃', '🚴', '🥗', '☕',
  '🧴', '📱', '🌱', '🎯', '🧠', '💬', '🪥', '✅',
]

const TYPE_OPTIONS: { id: HabitType; label: string; description: string }[] = [
  { id: 'daily', label: 'Every day', description: 'Shows up on all seven days' },
  { id: 'scheduled', label: 'Certain days', description: 'You choose which days' },
  {
    id: 'weekly_target',
    label: 'Weekly target',
    description: 'Any days — just hit the count',
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
  'w-full rounded-2xl border border-line bg-canvas px-4 py-3.5 text-[16px] text-ink outline-none transition placeholder:text-faint focus:border-accent focus:bg-surface'

interface HabitFormProps {
  habit?: Habit
  onSave: (data: Omit<Habit, 'id'>) => void
  onCancel: () => void
  onDelete?: () => void
}

export function HabitForm({ habit, onSave, onCancel, onDelete }: HabitFormProps) {
  const [name, setName] = useState(habit?.name ?? '')
  const [type, setType] = useState<HabitType>(habit?.type ?? 'daily')
  const [emoji, setEmoji] = useState(habit?.emoji ?? '✅')
  const [timeLabel, setTimeLabel] = useState(habit?.timeLabel ?? '')
  const [scheduledDays, setScheduledDays] = useState<number[]>(
    habit?.scheduledDays ?? [1, 3, 5],
  )
  const [weeklyTarget, setWeeklyTarget] = useState(habit?.weeklyTarget ?? 5)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const toggleDay = (day: number) => {
    setScheduledDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    )
  }

  const canSave =
    name.trim().length > 0 &&
    (type !== 'scheduled' || scheduledDays.length > 0)

  const handleSubmit = () => {
    if (!canSave) return
    onSave({
      name: name.trim(),
      type,
      emoji,
      timeLabel: timeLabel.trim() || undefined,
      scheduledDays: type === 'scheduled' ? [...scheduledDays].sort() : undefined,
      weeklyTarget: type === 'weekly_target' ? weeklyTarget : undefined,
    })
  }

  const preview: Habit = {
    id: 'preview',
    name: name.trim() || 'New habit',
    type,
    scheduledDays,
    weeklyTarget,
  }

  return (
    <Sheet
      title={habit ? 'Edit habit' : 'New habit'}
      onClose={onCancel}
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-2xl border border-line py-3.5 text-[15px] font-semibold text-muted transition active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSave}
            className="flex-[1.4] rounded-2xl bg-accent py-3.5 text-[15px] font-semibold text-canvas shadow-glow transition active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
          >
            {habit ? 'Save changes' : 'Add habit'}
          </button>
        </div>
      }
    >
      <div className="space-y-6 pb-2">
        <div className="flex items-center gap-3.5 rounded-3xl bg-accent-wash px-4 py-3.5">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-surface text-[1.35rem] shadow-soft">
            {emoji}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[15px] font-semibold text-ink">
              {preview.name}
            </span>
            <span className="block text-[13px] text-accent-ink">
              {describeSchedule(preview)}
              {timeLabel.trim() ? ` · ${timeLabel.trim()}` : ''}
            </span>
          </span>
        </div>

        <div>
          <FieldLabel>Name</FieldLabel>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Gym, wake up, read…"
            className={inputClass}
            autoFocus
          />
        </div>

        <div>
          <FieldLabel>Icon</FieldLabel>
          <div className="grid grid-cols-8 gap-1.5">
            {EMOJI_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setEmoji(option)}
                aria-label={`Icon ${option}`}
                aria-pressed={emoji === option}
                className={`grid aspect-square place-items-center rounded-xl text-lg transition active:scale-90 ${
                  emoji === option
                    ? 'bg-accent/15 ring-2 ring-accent'
                    : 'bg-canvas hover:bg-accent-wash'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <FieldLabel>Rhythm</FieldLabel>
          <div className="space-y-2">
            {TYPE_OPTIONS.map((option) => {
              const active = type === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setType(option.id)}
                  aria-pressed={active}
                  className={`flex w-full items-center gap-3.5 rounded-2xl border px-4 py-3.5 text-left transition active:scale-[0.99] ${
                    active
                      ? 'border-accent bg-accent-wash'
                      : 'border-line bg-canvas hover:border-line-strong'
                  }`}
                >
                  <span
                    className={`grid size-5 shrink-0 place-items-center rounded-full border-2 transition ${
                      active ? 'border-accent bg-accent' : 'border-line-strong'
                    }`}
                  >
                    {active && (
                      <span className="size-1.5 rounded-full bg-canvas" />
                    )}
                  </span>
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

        {type === 'scheduled' && (
          <div>
            <FieldLabel>Which days</FieldLabel>
            <div className="flex gap-1.5">
              {WEEK_DAY_ORDER.map((day) => {
                const active = scheduledDays.includes(day)
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    aria-label={DAY_LABELS[day]}
                    aria-pressed={active}
                    className={`h-11 flex-1 rounded-xl text-[13px] font-bold transition active:scale-95 ${
                      active
                        ? 'bg-accent text-canvas shadow-glow'
                        : 'bg-canvas text-muted hover:bg-accent-wash'
                    }`}
                  >
                    {DAY_LABELS[day].slice(0, 1)}
                  </button>
                )
              })}
            </div>
            {scheduledDays.length === 0 && (
              <p className="mt-2 text-[13px] text-rose">Pick at least one day.</p>
            )}
          </div>
        )}

        {type === 'weekly_target' && (
          <div>
            <FieldLabel>Times per week</FieldLabel>
            <div className="flex items-center gap-4 rounded-2xl border border-line bg-canvas p-2.5">
              <button
                type="button"
                onClick={() => setWeeklyTarget((v) => Math.max(1, v - 1))}
                aria-label="Decrease target"
                className="grid size-11 place-items-center rounded-xl bg-surface text-ink shadow-soft transition active:scale-90"
              >
                <Minus className="size-4" />
              </button>
              <span className="flex-1 text-center text-2xl font-bold tabular-nums text-ink">
                {weeklyTarget}
              </span>
              <button
                type="button"
                onClick={() => setWeeklyTarget((v) => Math.min(7, v + 1))}
                aria-label="Increase target"
                className="grid size-11 place-items-center rounded-xl bg-surface text-ink shadow-soft transition active:scale-90"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>
        )}

        <div>
          <FieldLabel>Time of day (optional)</FieldLabel>
          <input
            type="text"
            value={timeLabel}
            onChange={(e) => setTimeLabel(e.target.value)}
            placeholder="8:00 AM"
            className={inputClass}
          />
        </div>

        {onDelete && (
          <button
            type="button"
            onClick={() => {
              if (confirmDelete) onDelete()
              else setConfirmDelete(true)
            }}
            className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-[15px] font-semibold transition active:scale-[0.99] ${
              confirmDelete
                ? 'border-rose bg-rose/10 text-rose'
                : 'border-line text-muted hover:text-rose'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Trash2 className="size-4" />
              {confirmDelete ? 'Tap again to delete' : 'Delete habit'}
            </span>
            <ChevronRight className="size-4 opacity-50" />
          </button>
        )}
      </div>
    </Sheet>
  )
}

interface HabitListItemProps {
  habit: Habit
  onEdit: () => void
  index?: number
}

const TYPE_BADGE: Record<HabitType, string> = {
  daily: 'Daily',
  scheduled: 'Custom',
  weekly_target: 'Weekly',
}

export function HabitListItem({ habit, onEdit, index = 0 }: HabitListItemProps) {
  return (
    <button
      type="button"
      onClick={onEdit}
      style={{ animationDelay: `${index * 55}ms` }}
      className="animate-rise group flex w-full items-center gap-3.5 rounded-4xl border border-line bg-surface px-4 py-3.5 text-left shadow-soft transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:shadow-lift active:scale-[0.985]"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-accent-wash text-[1.35rem]">
        {habit.emoji ?? '✓'}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-[16px] font-semibold tracking-[-0.015em] text-ink">
            {habit.name}
          </span>
          <span className="shrink-0 rounded-md bg-accent-wash px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-ink">
            {TYPE_BADGE[habit.type]}
          </span>
        </span>
        <span className="mt-0.5 block truncate text-[13px] text-muted">
          {describeSchedule(habit)}
          {habit.timeLabel ? ` · ${habit.timeLabel}` : ''}
        </span>
      </span>

      <ChevronRight className="size-4.5 shrink-0 text-faint transition group-hover:translate-x-0.5 group-hover:text-accent" />
    </button>
  )
}
