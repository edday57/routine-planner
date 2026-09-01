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

export type Page = 'today' | 'week' | 'habits'
