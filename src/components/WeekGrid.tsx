import { Check } from 'lucide-react'
import type { Completion, Habit } from '../types'
import {
  canToggleOnDay,
  describeSchedule,
  formatDate,
  getWeekDates,
  isCompletedOnDate,
  isHabitScheduledOnDay,
  isSameDay,
} from '../lib/weekUtils'
import { getWeekOverview, getWeekSummary } from '../lib/progress'
import { hapticLight, hapticSuccess } from '../lib/haptics'
import { EmptyState } from './EmptyState'
import { ProgressRing } from './ProgressRing'

interface WeekGridProps {
  habits: Habit[]
  completions: Completion[]
  weekAnchor: Date
  onToggle: (habitId: string, date: string) => void
}

export function WeekGrid({
  habits,
  completions,
  weekAnchor,
  onToggle,
}: WeekGridProps) {
  const weekDates = getWeekDates(weekAnchor)
  const summary = getWeekSummary(habits, completions, weekDates)
  const overview = getWeekOverview(habits, completions, weekDates)
  const today = new Date()

  const handleToggle = (habitId: string, dateStr: string, wasDone: boolean) => {
    if (wasDone) hapticLight()
    else hapticSuccess()
    onToggle(habitId, dateStr)
  }

  if (habits.length === 0) {
    return (
      <EmptyState
        emoji="📅"
        title="Nothing to show yet"
        description="Add a few habits and your week will start filling in here."
      />
    )
  }

  return (
    <div className="space-y-5">
      <section className="glass relative overflow-hidden rounded-5xl p-5">
        <div
          aria-hidden="true"
          className="accent-fill pointer-events-none absolute -left-20 -top-24 size-52 rounded-full opacity-25 blur-3xl"
        />
        <div className="relative flex items-center gap-5">
          <ProgressRing percent={overview.percent} size={88} strokeWidth={9}>
            <span className="text-[20px] font-bold tabular-nums tracking-[-0.03em] text-ink">
              {Math.round(overview.percent)}%
            </span>
          </ProgressRing>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent-ink">
              Week progress
            </p>
            <p className="mt-1.5 text-[22px] font-bold leading-tight tracking-[-0.03em] text-ink">
              {overview.completed} of {overview.total}
            </p>
            <p className="mt-1 text-[13px] text-muted">
              habit check-offs completed
            </p>
          </div>
        </div>
      </section>

      <div className="space-y-3">
        {summary.map(({ habit, progress }, habitIndex) => (
          <section
            key={habit.id}
            style={{ animationDelay: `${habitIndex * 55}ms` }}
            className="glass animate-rise rounded-4xl p-4"
          >
            <div className="mb-3.5 flex items-center gap-3">
              <span className="glass-well grid size-10 shrink-0 place-items-center rounded-2xl text-xl">
                {habit.emoji ?? '✓'}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold tracking-[-0.015em] text-ink">
                  {habit.name}
                </p>
                <p className="text-[12px] text-faint">{describeSchedule(habit)}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold tabular-nums ${
                  progress.percent >= 100
                    ? 'accent-fill text-on-accent'
                    : 'bg-accent-wash text-accent-ink'
                }`}
              >
                {progress.completed}/{progress.total}
              </span>
            </div>

            <div className="flex gap-1.5">
              {weekDates.map((date) => {
                const dateStr = formatDate(date)
                const scheduled = isHabitScheduledOnDay(habit, date)
                const completed = isCompletedOnDate(habit.id, dateStr, completions)
                const enabled =
                  completed || canToggleOnDay(habit, date, completions, weekDates)
                const isToday = isSameDay(date, today)

                return (
                  <div
                    key={dateStr}
                    className="flex flex-1 flex-col items-center gap-1.5"
                  >
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        isToday ? 'text-accent-ink' : 'text-faint'
                      }`}
                    >
                      {date.toLocaleDateString('en-GB', { weekday: 'narrow' })}
                    </span>

                    {scheduled ? (
                      <button
                        type="button"
                        disabled={!enabled}
                        onClick={() => handleToggle(habit.id, dateStr, completed)}
                        aria-pressed={completed}
                        aria-label={`${habit.name} on ${date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}`}
                        className={`grid h-11 w-full place-items-center rounded-2xl transition-all duration-300 ease-spring active:scale-90 ${
                          completed
                            ? 'accent-fill text-on-accent shadow-glow'
                            : enabled
                              ? `glass-well text-muted hover:text-ink ${
                                  isToday
                                    ? 'ring-2 ring-accent-hi ring-offset-2 ring-offset-transparent'
                                    : ''
                                }`
                              : 'glass-well text-faint opacity-45'
                        }`}
                      >
                        {completed ? (
                          <Check className="size-4" strokeWidth={3} />
                        ) : (
                          <span className="text-[13px] font-semibold tabular-nums">
                            {date.getDate()}
                          </span>
                        )}
                      </button>
                    ) : (
                      <span className="grid h-11 w-full place-items-center">
                        <span className="size-1 rounded-full bg-line-strong" />
                      </span>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="mt-3.5 h-1.5 overflow-hidden rounded-full bg-line-strong/40">
              <div
                className="accent-fill h-full rounded-full transition-[width] duration-700 ease-spring"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
