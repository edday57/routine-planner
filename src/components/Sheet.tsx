import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface SheetProps {
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}

/**
 * Portalled to the body so ancestor transforms never become the containing
 * block for this fixed overlay.
 */
export function Sheet({ title, onClose, children, footer }: SheetProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  return createPortal(
    <div
      className="animate-fade fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong animate-sheet flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-5xl sm:max-w-lg sm:rounded-5xl"
      >
        <div className="shrink-0 px-6 pb-4 pt-3">
          <div className="mx-auto mb-4 h-1.5 w-11 rounded-full bg-line-strong sm:hidden" />
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold tracking-[-0.02em] text-ink">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="glass-well grid size-9 place-items-center rounded-full text-muted transition hover:text-ink active:scale-90"
            >
              <X className="size-4.5" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-2">{children}</div>

        {footer && (
          <div className="shrink-0 border-t border-line px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
