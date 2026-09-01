import type { Completion, Habit } from '../types'
import { TodayView } from '../components/TodayView'
import { PageHeader } from '../components/PageHeader'

interface TodayPageProps {
  habits: Habit[]
  completions: Completion[]
  onToggle: (habitId: string, date: string) => void
}

export function TodayPage({ habits, completions, onToggle }: TodayPageProps) {
  return (
    <div className="space-y-6">
      <PageHeader title="Today" subtitle="Tap a habit when you finish it" />
      <TodayView habits={habits} completions={completions} onToggle={onToggle} />
    </div>
  )
}
