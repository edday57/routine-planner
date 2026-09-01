import { useState } from 'react'
import type { Page } from './types'
import { BottomNav } from './components/BottomNav'
import { TopBar } from './components/TopBar'
import { HabitsPage } from './pages/HabitsPage'
import { TodayPage } from './pages/TodayPage'
import { WeekPage } from './pages/WeekPage'
import { useCompletions } from './hooks/useCompletions'
import { useHabits } from './hooks/useHabits'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const [page, setPage] = useState<Page>('today')
  const [weekAnchor, setWeekAnchor] = useState(new Date())
  const { habits, addHabit, updateHabit, deleteHabit } = useHabits()
  const { completions, toggleCompletion } = useCompletions()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="mx-auto min-h-full max-w-lg px-4 pb-32 pt-[max(1rem,env(safe-area-inset-top))]">
      <TopBar theme={theme} onToggleTheme={toggleTheme} />

      {/* Opacity-only transition: a lingering transform would capture fixed children. */}
      <main key={page} className="animate-fade">
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
      </main>

      <BottomNav current={page} onChange={setPage} />
    </div>
  )
}
