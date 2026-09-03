import type { ReactNode } from 'react'
import type { Completion, Goal, GoalStep, Habit } from '../types'
import { DidSomethingBar } from '../components/DidSomethingBar'
import { GoalMomentum } from '../components/GoalMomentum'
import { TodayView } from '../components/TodayView'

interface TodayPageProps {
  habits: Habit[]
  completions: Completion[]
  onToggle: (habitId: string, date: string) => void
  banner?: ReactNode
  goals: Goal[]
  steps: GoalStep[]
  onAddStep: (goalId: string, title: string) => void
  onSeeGoals: () => void
}

export function TodayPage({
  habits,
  completions,
  onToggle,
  banner,
  goals,
  steps,
  onAddStep,
  onSeeGoals,
}: TodayPageProps) {
  return (
    <div className="space-y-5">
      {banner}
      <TodayView
        habits={habits}
        completions={completions}
        onToggle={onToggle}
        afterWeek={
          <DidSomethingBar goals={goals} steps={steps} onAddStep={onAddStep} />
        }
      />
      <GoalMomentum
        goals={goals}
        steps={steps}
        onAddStep={onAddStep}
        onSeeAll={onSeeGoals}
      />
    </div>
  )
}
