import { useState } from 'react'
import type { Page } from './types'
import { AuthSheet } from './components/AuthSheet'
import { BottomNav } from './components/BottomNav'
import { TopBar } from './components/TopBar'
import { HabitsPage } from './pages/HabitsPage'
import { TodayPage } from './pages/TodayPage'
import { WeekPage } from './pages/WeekPage'
import { useAuth } from './hooks/useAuth'
import { useRoutine } from './hooks/useRoutine'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const [page, setPage] = useState<Page>('today')
  const [weekAnchor, setWeekAnchor] = useState(new Date())
  const [showAuth, setShowAuth] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const auth = useAuth()
  const { habits, completions, addHabit, updateHabit, deleteHabit, toggleCompletion } =
    useRoutine(auth.user?.id, auth.ready)

  return (
    <>
      <div className="app-backdrop" aria-hidden="true" />

      <div className="relative mx-auto min-h-full max-w-lg px-4 pb-32 pt-[max(1rem,env(safe-area-inset-top))]">
        <TopBar
          theme={theme}
          user={auth.user}
          showAccount={auth.configured}
          onToggleTheme={toggleTheme}
          onOpenAccount={() => {
            auth.resetForm()
            setShowAuth(true)
          }}
        />

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

      {showAuth && (
        <AuthSheet
          user={auth.user}
          busy={auth.busy}
          error={auth.error}
          emailSent={auth.emailSent}
          onSendLink={auth.sendMagicLink}
          onVerifyCode={auth.verifyCode}
          onSignOut={auth.signOut}
          onClose={() => setShowAuth(false)}
        />
      )}
    </>
  )
}
