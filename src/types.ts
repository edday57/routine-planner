export type HabitType = 'daily' | 'scheduled' | 'weekly_target'

export interface Habit {
  id: string
  name: string
  type: HabitType
  scheduledDays?: number[]
  weeklyTarget?: number
  timeLabel?: string
  emoji?: string
}

export interface Completion {
  habitId: string
  date: string
}

export type Page = 'today' | 'week' | 'goals' | 'habits'

export type GoalHorizon = 'short' | 'long'
export type GoalStatus = 'active' | 'reached'

export interface Goal {
  id: string
  title: string
  why?: string
  horizon: GoalHorizon
  emoji?: string
  targetSteps?: number
  status: GoalStatus
}

export interface GoalStep {
  id: string
  goalId: string
  title: string
  date: string
}
