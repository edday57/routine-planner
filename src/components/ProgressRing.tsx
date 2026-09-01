import { useId, type ReactNode } from 'react'

interface ProgressRingProps {
  percent: number
  size?: number
  strokeWidth?: number
  children?: ReactNode
}

export function ProgressRing({
  percent,
  size = 104,
  strokeWidth = 10,
  children,
}: ProgressRingProps) {
  const gradientId = useId()
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(100, percent) / 100) * circumference

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${Math.round(percent)} percent complete`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--c-accent-hi)" />
            <stop offset="100%" stopColor="var(--c-accent)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--c-line-strong)"
          strokeWidth={strokeWidth}
          opacity={0.45}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-spring"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
          {children}
        </div>
      )}
    </div>
  )
}
