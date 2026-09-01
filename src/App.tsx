import { useState } from 'react'
import type { Page } from './types'
import { BottomNav } from './components/BottomNav'
import { HabitsPage } from './pages/HabitsPage'
import { TodayPage } from './pages/TodayPage'
import { WeekPage } from './pages/WeekPage'
import { useCompletions } from './hooks/useCompletions'
import { useHabits } from './hooks/useHabits'

export default function App() {
  const [page, setPage] = useState<Page>('today')
  const [weekAnchor, setWeekAnchor] = useState(new Date())
  const { habits, addHabit, updateHabit, deleteHabit } = useHabits()
  const { completions, toggleCompletion } = useCompletions()

  return (
    <div className="app-gradient mx-auto min-h-full max-w-lg">
      <main className="px-4 pb-32 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <div key={page} className="animate-fade-up">
          {page === 'today' && (
            <TodayPage
              habits={habits}
              completions={completions}
              onToggle={toggleCompletion}
            />
          )}
          {page === 'week' && (
            <WeekPage
              habits={habits}
              completions={completions}
              weekAnchor={weekAnchor}
              onWeekChange={setWeekAnchor}
              onToggle={toggleCompletion}
            />
          )}
          {page === 'habits' && (
            <HabitsPage
              habits={habits}
              onAdd={addHabit}
              onUpdate={updateHabit}
              onDelete={deleteHabit}
            />
          )}
        </div>
      </main>
      <BottomNav current={page} onChange={setPage} />
    </div>
  )
}
