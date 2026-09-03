import { Sparkles } from 'lucide-react'

interface WinToastProps {
  message: string
}

export function WinToast({ message }: WinToastProps) {
  return (
    <div
      role="status"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 animate-rise"
    >
      <p className="glass-strong flex max-w-sm items-center gap-2 rounded-full px-4 py-2.5 text-[14px] font-semibold text-ink shadow-glow">
        <Sparkles className="size-4 shrink-0 text-accent-ink" />
        {message}
      </p>
    </div>
  )
}
