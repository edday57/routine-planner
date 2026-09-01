import { Check } from 'lucide-react'
import type { Completion, Habit } from '../types'
import { getWeeklyCompletionCount } from '../lib/weekUtils'
import { hapticLight, hapticSuccess } from '../lib/haptics'

interface HabitRowProps {
  habit: Habit
  completed: boolean
  onToggle: () => void
  weekDates: Date[]
  completions: Completion[]
  index?: number
}

function WeeklyMeter({ count, target }: { count: number; target: number }) {
  return (
    <span className="mt-2.5 flex items-center gap-2">
      <span className="flex flex-1 gap-1">
        {Array.from({ length: target }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              i < count ? 'accent-fill' : 'bg-line-strong'
            }`}
          />
        ))}
      </span>
      <span className="text-[11px] font-semibold tabular-nums text-accent-ink">
        {count}/{target}
      </span>
    </span>
  )
}

export function HabitRow({
  habit,
  completed,
  onToggle,
  weekDates,
  completions,
  index = 0,
}: HabitRowProps) {
  const isWeekly = habit.type === 'weekly_target'
  const weeklyCount = isWeekly
    ? getWeeklyCompletionCount(habit, completions, weekDates)
    : 0

  const handleToggle = () => {
    if (completed) hapticLight()
    else hapticSuccess()
    onToggle()
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={completed}
      style={{ animationDelay: `${index * 55}ms` }}
      className={`animate-rise group flex w-full items-center gap-3.5 rounded-4xl px-4 py-3.5 text-left transition-all duration-300 ease-spring active:scale-[0.985] ${
        completed ? 'glass-tint' : 'glass hover:-translate-y-0.5'
      }`}
    >
      <span
        className={`glass-well grid size-11 shrink-0 place-items-center rounded-2xl text-[1.35rem] transition-transform duration-300 ${
          completed ? 'opacity-55' : 'group-active:scale-95'
        }`}
      >
        {habit.emoji ?? '✓'}
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={`block truncate text-[16px] font-semibold tracking-[-0.015em] transition-colors ${
            completed ? 'text-muted' : 'text-ink'
          }`}
        >
          {habit.name}
        </span>

        {completed ? (
          <span className="mt-0.5 block text-[13px] font-medium text-accent-ink">
            Done today
          </span>
        ) : (
          habit.timeLabel && (
            <span className="mt-0.5 block text-[13px] text-faint">
              {habit.timeLabel}
            </span>
          )
        )}

        {isWeekly && !completed && (
          <WeeklyMeter count={weeklyCount} target={habit.weeklyTarget ?? 1} />
        )}
      </span>

      <span
        className={`grid size-11 shrink-0 place-items-center rounded-full transition-all duration-300 ${
          completed
            ? 'accent-fill animate-check-pop shadow-glow'
            : 'glass-well border-2 border-line-strong group-hover:border-accent/60'
        }`}
      >
        {completed && (
          <Check
            className="animate-check-draw size-5 text-on-accent"
            strokeWidth={3}
          />
        )}
      </span>
    </button>
  )
}
