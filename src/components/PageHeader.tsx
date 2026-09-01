import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-[1.65rem] font-bold tracking-tight text-stone-800">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-0.5 text-sm text-warm-gray-light">{subtitle}</p>
        )}
      </div>
      {action}
    </header>
  )
}
