import type { Completion, Habit } from '../types'
import { TodayView } from '../components/TodayView'

interface TodayPageProps {
  habits: Habit[]
  completions: Completion[]
  onToggle: (habitId: string, date: string) => void
}

export function TodayPage({ habits, completions, onToggle }: TodayPageProps) {
  return (
    <TodayView habits={habits} completions={completions} onToggle={onToggle} />
  )
}
