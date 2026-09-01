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
  showWeeklyBadge?: boolean
  index?: number
}

function WeeklyDots({
  count,
  target,
}: {
  count: number
  target: number
}) {
  return (
    <div className="mt-2 flex items-center gap-1.5">
      {Array.from({ length: target }, (_, i) => (
        <span
          key={i}
          className={`h-2 flex-1 max-w-5 rounded-full transition-colors duration-300 ${
            i < count ? 'bg-sage' : 'bg-cream-dark'
          }`}
        />
      ))}
      <span className="ml-1 text-xs font-semibold tabular-nums text-sage">
        {count}/{target}
      </span>
    </div>
  )
}

export function HabitRow({
  habit,
  completed,
  onToggle,
  weekDates,
  completions,
  showWeeklyBadge = true,
  index = 0,
}: HabitRowProps) {
  const weeklyCount =
    habit.type === 'weekly_target'
      ? getWeeklyCompletionCount(habit, completions, weekDates)
      : 0
  const weeklyTarget = habit.weeklyTarget ?? 1

  const handleToggle = () => {
    if (!completed) hapticSuccess()
    else hapticLight()
    onToggle()
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      style={{ animationDelay: `${index * 60}ms` }}
      className={`animate-fade-up group flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-all duration-200 active:scale-[0.98] ${
        completed
          ? 'border-sage/25 bg-sage/8 shadow-none'
          : 'border-white/80 bg-white shadow-[0_2px_12px_rgba(45,42,38,0.06)] hover:shadow-[0_4px_16px_rgba(45,42,38,0.08)]'
      }`}
    >
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl transition-all ${
          completed
            ? 'bg-sage/15 opacity-70'
            : 'bg-sage-muted group-active:scale-95'
        }`}
      >
        {habit.emoji ?? '✓'}
      </span>

      <div className="min-w-0 flex-1">
        <p
          className={`text-[1.05rem] font-semibold leading-snug transition-colors ${
            completed ? 'text-warm-gray' : 'text-stone-800'
          }`}
        >
          {habit.name}
        </p>
        {habit.timeLabel && !completed && (
          <p className="mt-0.5 text-sm text-warm-gray-light">{habit.timeLabel}</p>
        )}
        {showWeeklyBadge && habit.type === 'weekly_target' && (
          <WeeklyDots count={weeklyCount} target={weeklyTarget} />
        )}
        {completed && (
          <p className="mt-0.5 text-sm font-medium text-sage">Done</p>
        )}
      </div>

      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
          completed
            ? 'border-sage bg-sage shadow-[0_2px_8px_rgba(90,138,122,0.35)] animate-check-pop'
            : 'border-cream-dark bg-cream group-hover:border-sage/40'
        }`}
      >
        {completed && (
          <Check className="h-5 w-5 text-white animate-check-draw" strokeWidth={3} />
        )}
      </span>
    </button>
  )
}
