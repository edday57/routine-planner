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
  const start = weekDates[0]
  const end = weekDates[6]

  const shiftWeek = (delta: number) => {
    const next = new Date(weekAnchor)
    next.setDate(next.getDate() + delta * 7)
    onWeekChange(next)
  }

  const goToThisWeek = () => onWeekChange(new Date())

  const isCurrentWeek =
    formatDate(getWeekDates(new Date())[0]) === formatDate(weekDates[0])

  return (
    <div className="space-y-6">
      <PageHeader title="Week" subtitle="See how the week is shaping up" />

      <div className="flex items-center justify-between rounded-2xl border border-white/80 bg-white px-3 py-2.5 shadow-[0_2px_12px_rgba(45,42,38,0.06)]">
        <button
          type="button"
          onClick={() => shiftWeek(-1)}
          className="rounded-xl p-2.5 text-warm-gray transition hover:bg-cream active:scale-95"
          aria-label="Previous week"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="text-center">
          <p className="font-semibold text-stone-800">
            {start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
            {' – '}
            {end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </p>
          {!isCurrentWeek && (
            <button
              type="button"
              onClick={goToThisWeek}
              className="mt-0.5 text-sm font-semibold text-sage active:opacity-70"
            >
              Jump to this week
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => shiftWeek(1)}
          className="rounded-xl p-2.5 text-warm-gray transition hover:bg-cream active:scale-95"
          aria-label="Next week"
        >
          <ChevronRight className="h-5 w-5" />
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
