interface SyncNudgeProps {
  onSignIn: () => void
}

export function SyncNudge({ onSignIn }: SyncNudgeProps) {
  return (
    <button
      type="button"
      onClick={onSignIn}
      className="glass flex w-full items-start gap-3 rounded-4xl px-4 py-3.5 text-left transition active:scale-[0.99]"
    >
      <span className="accent-fill mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl text-[13px] font-bold text-on-accent">
        i
      </span>
      <span className="min-w-0">
        <span className="block text-[14px] font-semibold text-ink">
          Sign in to keep ticks
        </span>
        <span className="mt-0.5 block text-[13px] leading-relaxed text-muted">
          Safari and the home-screen app don’t share local data. A sign-in code
          ties them together.
        </span>
      </span>
    </button>
  )
}
