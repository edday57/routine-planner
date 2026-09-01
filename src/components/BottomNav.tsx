import { CalendarDays, LayoutList, Sun } from 'lucide-react'
import type { Page } from '../types'

interface BottomNavProps {
  current: Page
  onChange: (page: Page) => void
}

const NAV_ITEMS: { id: Page; label: string; icon: typeof Sun }[] = [
  { id: 'today', label: 'Today', icon: Sun },
  { id: 'week', label: 'Week', icon: CalendarDays },
  { id: 'habits', label: 'Habits', icon: LayoutList },
]

export function BottomNav({ current, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
      <div className="glass-card mx-auto flex max-w-lg items-center rounded-2xl border border-white/60 p-1.5 shadow-[0_4px_24px_rgba(45,42,38,0.1)]">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = current === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`relative flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2.5 transition-all duration-200 ${
                active ? 'text-white' : 'text-warm-gray-light active:scale-95'
              }`}
            >
              {active && (
                <span className="absolute inset-0 rounded-xl bg-sage shadow-[0_2px_8px_rgba(90,138,122,0.35)]" />
              )}
              <Icon
                className="relative h-5 w-5"
                strokeWidth={active ? 2.5 : 2}
              />
              <span className="relative text-[11px] font-semibold">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
