import type { ReactNode } from 'react'

interface EmptyStateProps {
  emoji: string
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ emoji, title, description, action }: EmptyStateProps) {
  return (
    <div className="glass flex flex-col items-center rounded-5xl px-6 py-12 text-center">
      <span className="glass-well mb-4 grid size-16 place-items-center rounded-3xl text-3xl">
        {emoji}
      </span>
      <p className="text-base font-semibold tracking-[-0.01em] text-ink">
        {title}
      </p>
      <p className="mt-1.5 max-w-[15rem] text-sm leading-relaxed text-muted">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
