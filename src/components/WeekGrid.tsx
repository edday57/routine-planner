import type { Completion, Habit } from '../types'
import {
  canToggleOnDay,
  formatDate,
  getWeekDates,
  isCompletedOnDate,
  isHabitScheduledOnDay,
  isSameDay,
} from '../lib/weekUtils'
import { getWeekSummary } from '../lib/progress'
import { hapticLight, hapticSuccess } from '../lib/haptics'
import { EmptyState } from './EmptyState'

interface WeekGridProps {
  habits: Habit[]
  completions: Completion[]
  weekAnchor: Date
  onToggle: (habitId: string, date: string) => void
}

export function WeekGrid({ habits, completions, weekAnchor, onToggle }: WeekGridProps) {
  const weekDates = getWeekDates(weekAnchor)
  const summary = getWeekSummary(habits, completions, weekDates)

  const handleToggle = (habitId: string, dateStr: string, wasCompleted: boolean) => {
    if (wasCompleted) hapticLight()
    else hapticSuccess()
    onToggle(habitId, dateStr)
  }

  if (habits.length === 0) {
    return (
      <EmptyState
        emoji="📅"
        title="No habits yet"
        description="Add habits in the library to see your week fill in."
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {habits.map((habit, habitIndex) => (
          <div
            key={habit.id}
            style={{ animationDelay: `${habitIndex * 50}ms` }}
            className="animate-fade-up rounded-2xl border border-white/80 bg-white p-4 shadow-[0_2px_12px_rgba(45,42,38,0.06)]"
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage-muted text-xl">
                {habit.emoji ?? '✓'}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-stone-800">{habit.name}</p>
                <p className="text-xs text-warm-gray-light">
                  {habit.type === 'weekly_target'
                    ? `${habit.weeklyTarget}x per week`
                    : habit.type === 'scheduled'
                      ? 'Specific days'
                      : 'Every day'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {weekDates.map((date) => {
                const dateStr = formatDate(date)
                const scheduled = isHabitScheduledOnDay(habit, date)
                const completed = isCompletedOnDate(habit.id, dateStr, completions)
                const canToggle = canToggleOnDay(
                  habit,
                  date,
                  completions,
                  weekDates,
                )
                const isToday = isSameDay(date, new Date())

                return (
                  <div key={dateStr} className="flex flex-col items-center gap-1">
                    <span
                      className={`text-[10px] font-semibold uppercase ${
                        isToday ? 'text-sage' : 'text-warm-gray-light'
                      }`}
                    >
                      {date.toLocaleDateString('en-GB', { weekday: 'narrow' })}
                    </span>
                    {scheduled ? (
                      <button
                        type="button"
                        disabled={!canToggle && !completed}
                        onClick={() => handleToggle(habit.id, dateStr, completed)}
                        className={`flex h-10 w-full flex-col items-center justify-center rounded-xl transition-all active:scale-90 ${
                          completed
                            ? 'bg-sage text-white shadow-[0_2px_6px_rgba(90,138,122,0.3)]'
                            : canToggle
                              ? isToday
                                ? 'bg-sage-muted ring-2 ring-sage/30'
                                : 'bg-cream hover:bg-cream-dark'
                              : 'bg-cream/40 opacity-50'
                        }`}
                        aria-label={`Toggle ${habit.name} on ${dateStr}`}
                      >
                        <span className="text-[10px] font-medium tabular-nums">
                          {date.getDate()}
                        </span>
                        {completed && (
                          <span className="text-[10px] font-bold leading-none">✓</span>
                        )}
                      </button>
                    ) : (
                      <span className="flex h-10 w-full items-center justify-center rounded-xl bg-transparent">
                        <span className="h-1 w-1 rounded-full bg-cream-dark" />
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <section>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-warm-gray-light">
          Week progress
        </h3>
        <div className="space-y-3">
          {summary.map(({ habit, progress }, i) => (
            <div
              key={habit.id}
              style={{ animationDelay: `${i * 40}ms` }}
              className="animate-fade-up rounded-2xl border border-white/80 bg-white p-4 shadow-[0_2px_12px_rgba(45,42,38,0.06)]"
            >
              <div className="mb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{habit.emoji ?? '✓'}</span>
                  <span className="font-semibold text-stone-800">{habit.name}</span>
                </div>
                <span className="rounded-full bg-sage-muted px-2.5 py-0.5 text-xs font-bold tabular-nums text-sage-dark">
                  {progress.completed}/{progress.total}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-cream-dark">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sage-light to-sage transition-all duration-700 ease-out"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
              {progress.percent >= 100 && (
                <p className="mt-2 text-sm font-medium text-sage">
                  Nice work this week!
                </p>
              )}
              {progress.percent > 0 && progress.percent < 100 && (
                <p className="mt-2 text-sm text-warm-gray-light">
                  {Math.round(progress.percent)}% — keep going
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
