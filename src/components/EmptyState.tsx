import type { ReactNode } from 'react'

interface EmptyStateProps {
  emoji: string
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ emoji, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-cream-dark bg-white/50 px-6 py-10 text-center">
      <span className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-sage-muted text-3xl">
        {emoji}
      </span>
      <p className="font-medium text-stone-800">{title}</p>
      <p className="mt-1 max-w-[240px] text-sm leading-relaxed text-warm-gray-light">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
