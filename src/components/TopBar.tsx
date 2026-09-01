import { Moon, Sun } from 'lucide-react'
import type { Theme } from '../hooks/useTheme'

interface TopBarProps {
  theme: Theme
  onToggleTheme: () => void
}

export function TopBar({ theme, onToggleTheme }: TopBarProps) {
  const isDark = theme === 'dark'

  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <span className="accent-fill grid size-9 place-items-center rounded-2xl text-on-accent shadow-glow">
          <svg viewBox="0 0 24 24" className="size-4.5" aria-hidden="true">
            <path
              d="M6 12.5l3.5 3.5L18 7.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="text-[15px] font-semibold tracking-[-0.02em] text-ink">
          Routine
        </span>
      </div>

      <button
        type="button"
        onClick={onToggleTheme}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className="glass grid size-10 place-items-center rounded-full text-muted transition hover:text-ink active:scale-90"
      >
        {isDark ? <Moon className="size-4.5" /> : <Sun className="size-4.5" />}
      </button>
    </div>
  )
}
