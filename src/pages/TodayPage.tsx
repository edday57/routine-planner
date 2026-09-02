import type { ReactNode } from 'react'
import type { Completion, Habit } from '../types'
import { TodayView } from '../components/TodayView'

interface TodayPageProps {
  habits: Habit[]
  completions: Completion[]
  onToggle: (habitId: string, date: string) => void
  banner?: ReactNode
}

export function TodayPage({
  habits,
  completions,
  onToggle,
  banner,
}: TodayPageProps) {
  return (
    <div className="space-y-5">
      {banner}
      <TodayView habits={habits} completions={completions} onToggle={onToggle} />
    </div>
  )
}
