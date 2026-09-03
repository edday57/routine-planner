import { CalendarRange, ListChecks, Sparkles, Sun } from 'lucide-react'
import type { Page } from '../types'

interface BottomNavProps {
  current: Page
  onChange: (page: Page) => void
}

const NAV_ITEMS: { id: Page; label: string; icon: typeof Sun }[] = [
  { id: 'today', label: 'Today', icon: Sun },
  { id: 'week', label: 'Week', icon: CalendarRange },
  { id: 'goals', label: 'Goals', icon: Sparkles },
  { id: 'habits', label: 'Habits', icon: ListChecks },
]

export function BottomNav({ current, onChange }: BottomNavProps) {
  const activeIndex = NAV_ITEMS.findIndex((item) => item.id === current)

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.85rem,env(safe-area-inset-bottom))]">
      <div className="glass-strong pointer-events-auto relative mx-auto flex max-w-lg gap-1 rounded-full p-1.5">
        <span
          aria-hidden="true"
          className="accent-fill absolute inset-y-1.5 rounded-full shadow-glow transition-[left] duration-[420ms] ease-spring"
          style={{
            width: `calc((100% - 0.75rem) / ${NAV_ITEMS.length})`,
            left: `calc(0.375rem + ${activeIndex} * (100% - 0.75rem) / ${NAV_ITEMS.length})`,
          }}
        />
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = current === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-current={active ? 'page' : undefined}
              className={`relative z-10 flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-full py-2 text-[11px] font-semibold transition-colors duration-300 sm:flex-row sm:gap-1.5 sm:text-[13px] ${
                active ? 'text-on-accent' : 'text-muted hover:text-ink'
              }`}
            >
              <Icon className="size-4" strokeWidth={active ? 2.4 : 2} />
              {label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
