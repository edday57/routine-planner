import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Completion, Habit } from '../types'
import { WeekGrid } from '../components/WeekGrid'
import { PageHeader } from '../components/PageHeader'
import { formatDate, getWeekDates } from '../lib/weekUtils'

interface WeekPageProps {
  habits: Habit[]
  completions: Completion[]
  weekAnchor: Date
  onWeekChange: (date: Date) => void
  onToggle: (habitId: string, date: string) => void
}

export function WeekPage({
  habits,
  completions,
  weekAnchor,
  onWeekChange,
  onToggle,
}: WeekPageProps) {
  const weekDates = getWeekDates(weekAnchor)
  const [start, end] = [weekDates[0], weekDates[6]]
  const isCurrentWeek =
    formatDate(getWeekDates(new Date())[0]) === formatDate(start)

  const shiftWeek = (delta: number) => {
    const next = new Date(weekAnchor)
    next.setDate(next.getDate() + delta * 7)
    onWeekChange(next)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Week"
        subtitle={isCurrentWeek ? 'How this week is shaping up' : 'Looking back'}
      />

      <div className="flex items-center gap-2 rounded-full border border-line bg-surface p-1.5 shadow-soft">
        <button
          type="button"
          onClick={() => shiftWeek(-1)}
          aria-label="Previous week"
          className="grid size-10 shrink-0 place-items-center rounded-full text-muted transition hover:bg-accent-wash hover:text-ink active:scale-90"
        >
          <ChevronLeft className="size-4.5" />
        </button>

        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-[15px] font-semibold tracking-[-0.015em] text-ink">
            {start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
            {' – '}
            {end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </p>
          {isCurrentWeek ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
              This week
            </p>
          ) : (
            <button
              type="button"
              onClick={() => onWeekChange(new Date())}
              className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent transition active:opacity-60"
            >
              Back to today
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => shiftWeek(1)}
          aria-label="Next week"
          className="grid size-10 shrink-0 place-items-center rounded-full text-muted transition hover:bg-accent-wash hover:text-ink active:scale-90"
        >
          <ChevronRight className="size-4.5" />
        </button>
      </div>

      <WeekGrid
        habits={habits}
        completions={completions}
        weekAnchor={weekAnchor}
        onToggle={onToggle}
      />
    </div>
  )
}
