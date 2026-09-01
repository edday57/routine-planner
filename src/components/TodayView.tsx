import { Flame, PartyPopper } from 'lucide-react'
import type { Completion, Habit } from '../types'
import { HabitRow } from './HabitRow'
import { ProgressRing } from './ProgressRing'
import { EmptyState } from './EmptyState'
import { getDayStats, getTodayProgress } from '../lib/progress'
import { getShowUpStreak } from '../lib/streak'
import { getEncouragement, getGreeting } from '../lib/copy'
import {
  formatDate,
  formatDayFull,
  getWeekDates,
  isCompletedOnDate,
  isHabitDueOnDay,
  isSameDay,
} from '../lib/weekUtils'

interface TodayViewProps {
  habits: Habit[]
  completions: Completion[]
  onToggle: (habitId: string, date: string) => void
}

function SectionHeading({ label, count }: { label: string; count: number }) {
  return (
    <div className="mb-3 flex items-center gap-2.5 px-1">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-faint">
        {label}
      </h2>
      <span className="h-px flex-1 bg-line" />
      <span className="text-[11px] font-bold tabular-nums text-faint">
        {count}
      </span>
    </div>
  )
}

function WeekStrip({
  habits,
  completions,
  today,
}: {
  habits: Habit[]
  completions: Completion[]
  today: Date
}) {
  const weekDates = getWeekDates(today)

  return (
    <section className="glass rounded-4xl p-4">
      <h2 className="mb-3 px-1 text-[11px] font-bold uppercase tracking-[0.16em] text-faint">
        This week
      </h2>
      <div className="flex gap-1.5">
        {weekDates.map((date) => {
          const stats = getDayStats(habits, completions, date)
          const isToday = isSameDay(date, today)
          const isFuture = date > today && !isToday
          const filled = stats.percent >= 100 && stats.completed > 0

          return (
            <div
              key={formatDate(date)}
              className="flex flex-1 flex-col items-center gap-1.5"
            >
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  isToday ? 'text-accent-ink' : 'text-faint'
                }`}
              >
                {date.toLocaleDateString('en-GB', { weekday: 'narrow' })}
              </span>
              <div
                className={`relative grid h-11 w-full place-items-center overflow-hidden rounded-2xl transition-all ${
                  filled ? 'accent-fill shadow-glow' : 'glass-well'
                } ${isToday ? 'ring-2 ring-accent-hi ring-offset-2 ring-offset-transparent' : ''}`}
              >
                {!filled && stats.percent > 0 && (
                  <span
                    className="accent-fill absolute inset-x-0 bottom-0 opacity-40 transition-[height] duration-500"
                    style={{ height: `${stats.percent}%` }}
                  />
                )}
                <span
                  className={`relative text-[13px] font-bold tabular-nums ${
                    filled
                      ? 'text-on-accent'
                      : isFuture
                        ? 'text-faint'
                        : 'text-muted'
                  }`}
                >
                  {date.getDate()}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function TodayView({ habits, completions, onToggle }: TodayViewProps) {
  const today = new Date()
  const todayStr = formatDate(today)
  const weekDates = getWeekDates(today)
  const progress = getTodayProgress(habits, completions, today)
  const streak = getShowUpStreak(completions, today)

  const dueToday = habits.filter((h) =>
    isHabitDueOnDay(h, today, completions, weekDates),
  )
  const upNext = dueToday.filter(
    (h) => !isCompletedOnDate(h.id, todayStr, completions),
  )
  const done = dueToday.filter((h) =>
    isCompletedOnDate(h.id, todayStr, completions),
  )
  const allDone = progress.total > 0 && progress.completed === progress.total

  return (
    <div className="space-y-5">
      <section className="glass relative overflow-hidden rounded-5xl p-5">
        <div
          aria-hidden="true"
          className={`accent-fill pointer-events-none absolute -right-24 -top-28 size-60 rounded-full opacity-30 blur-3xl ${
            allDone ? 'animate-breathe' : ''
          }`}
        />

        <div className="relative flex items-center gap-5">
          <ProgressRing percent={progress.percent}>
            <span className="text-[26px] font-bold tabular-nums tracking-[-0.03em] text-ink">
              {progress.completed}
            </span>
            <span className="mt-1 text-[11px] font-semibold tabular-nums text-faint">
              of {progress.total}
            </span>
          </ProgressRing>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent-ink">
              {getGreeting(today)}
            </p>
            <h1 className="mt-1.5 text-[26px] font-bold leading-none tracking-[-0.03em] text-ink">
              {formatDayFull(today)}
            </h1>
            <p className="mt-1.5 text-[13px] text-muted">
              {today.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
              })}
            </p>
            <p className="mt-2.5 text-[13px] font-medium text-muted">
              {getEncouragement(progress.completed, progress.total)}
            </p>
          </div>
        </div>

        {streak > 0 && (
          <div className="relative mt-4 inline-flex items-center gap-2 rounded-full bg-amber-wash px-3.5 py-2 ring-1 ring-amber/25">
            <Flame className="size-4 text-amber" />
            <span className="text-[13px] font-semibold text-amber-ink">
              {streak} day{streak === 1 ? '' : 's'} in a row
            </span>
          </div>
        )}

        {allDone && (
          <div className="relative mt-4 flex items-center gap-3 rounded-3xl bg-accent-wash px-4 py-3.5 ring-1 ring-accent/25">
            <PartyPopper className="size-4.5 shrink-0 text-accent-ink" />
            <p className="text-[13px] font-medium text-accent-ink">
              Everything ticked off. You showed up today — that counts.
            </p>
          </div>
        )}
      </section>

      {habits.length > 0 && (
        <WeekStrip habits={habits} completions={completions} today={today} />
      )}

      {dueToday.length === 0 ? (
        <EmptyState
          emoji="🌿"
          title="Nothing due today"
          description="No habits are scheduled for today. Enjoy the breathing room, or add one from the Habits tab."
        />
      ) : (
        <>
          {upNext.length > 0 && (
            <section>
              <SectionHeading label="Up next" count={upNext.length} />
              <ul className="space-y-2.5">
                {upNext.map((habit, i) => (
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

          {done.length > 0 && (
            <section>
              <SectionHeading label="Completed" count={done.length} />
              <ul className="space-y-2.5">
                {done.map((habit, i) => (
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
