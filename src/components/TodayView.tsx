import { Sparkles } from 'lucide-react'
import type { Completion, Habit } from '../types'
import { HabitRow } from './HabitRow'
import { ProgressRing } from './ProgressRing'
import { EmptyState } from './EmptyState'
import { getTodayProgress } from '../lib/progress'
import { getEncouragement, getGreeting } from '../lib/copy'
import {
  formatDate,
  formatDayName,
  getWeekDates,
  isCompletedOnDate,
  isHabitDueOnDay,
} from '../lib/weekUtils'

interface TodayViewProps {
  habits: Habit[]
  completions: Completion[]
  onToggle: (habitId: string, date: string) => void
}

export function TodayView({ habits, completions, onToggle }: TodayViewProps) {
  const today = new Date()
  const todayStr = formatDate(today)
  const weekDates = getWeekDates(today)
  const progress = getTodayProgress(habits, completions, today)

  const dueToday = habits.filter((h) =>
    isHabitDueOnDay(h, today, completions, weekDates),
  )

  const incomplete = dueToday.filter(
    (h) => !isCompletedOnDate(h.id, todayStr, completions),
  )
  const complete = dueToday.filter((h) =>
    isCompletedOnDate(h.id, todayStr, completions),
  )

  const allDone = progress.total > 0 && progress.completed === progress.total

  return (
    <div className="space-y-6">
      <header
        className={`hero-gradient relative overflow-hidden rounded-3xl border border-white/60 p-5 shadow-[0_4px_24px_rgba(90,138,122,0.1)] ${
          allDone ? 'animate-celebrate' : ''
        }`}
      >
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-sage/10 blur-2xl" />
        <div className="relative flex items-center gap-5">
          <ProgressRing percent={progress.percent} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-sage-dark">
              {getGreeting(today)}
            </p>
            <p className="text-lg font-bold text-stone-800">
              {formatDayName(today)},{' '}
              {today.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
              })}
            </p>
            <p className="mt-1 text-sm text-warm-gray">
              <span className="font-semibold tabular-nums text-stone-800">
                {progress.completed}
              </span>
              {' of '}
              <span className="tabular-nums">{progress.total}</span>
              {' '}
              {progress.total === 1 ? 'habit' : 'habits'}
            </p>
            <p className="mt-0.5 text-sm font-medium text-sage">
              {getEncouragement(progress.completed, progress.total)}
            </p>
          </div>
        </div>

        {allDone && (
          <div className="relative mt-4 flex items-center gap-2 rounded-2xl bg-gold-light px-4 py-3">
            <Sparkles className="h-4 w-4 shrink-0 text-gold" />
            <p className="text-sm font-medium text-stone-700">
              You showed up today. That counts.
            </p>
          </div>
        )}
      </header>

      {dueToday.length === 0 ? (
        <EmptyState
          emoji="🌿"
          title="Nothing on today"
          description="No habits scheduled for today — enjoy the breathing room, or add habits in the library."
        />
      ) : (
        <>
          {incomplete.length > 0 && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-warm-gray-light">
                <span className="h-1.5 w-1.5 rounded-full bg-sage" />
                Still to do
                <span className="ml-auto rounded-full bg-cream-dark px-2 py-0.5 text-[10px] tabular-nums">
                  {incomplete.length}
                </span>
              </h2>
              <ul className="space-y-3">
                {incomplete.map((habit, i) => (
                  <li key={habit.id}>
                    <HabitRow
                      habit={habit}
                      completed={false}
                      onToggle={() => onToggle(habit.id, todayStr)}
                      weekDates={weekDates}
                      completions={completions}
                      index={i}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {complete.length > 0 && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-warm-gray-light">
                <span className="h-1.5 w-1.5 rounded-full bg-sage/50" />
                Done today
                <span className="ml-auto rounded-full bg-sage-muted px-2 py-0.5 text-[10px] tabular-nums text-sage-dark">
                  {complete.length}
                </span>
              </h2>
              <ul className="space-y-3">
                {complete.map((habit, i) => (
                  <li key={habit.id}>
                    <HabitRow
                      habit={habit}
                      completed
                      onToggle={() => onToggle(habit.id, todayStr)}
                      weekDates={weekDates}
                      completions={completions}
                      index={i}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  )
}
