import { useState } from 'react'
import { LogOut, Mail } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import { Sheet } from './Sheet'

interface AuthSheetProps {
  user: User | null
  busy: boolean
  error: string | null
  emailSent: boolean
  onSendLink: (email: string) => Promise<boolean>
  onVerifyCode: (email: string, token: string) => Promise<boolean>
  onSignOut: () => Promise<void>
  onClose: () => void
}

export function AuthSheet({
  user,
  busy,
  error,
  emailSent,
  onSendLink,
  onVerifyCode,
  onSignOut,
  onClose,
}: AuthSheetProps) {
  const [email, setEmail] = useState(user?.email ?? '')
  const [code, setCode] = useState('')

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    await onSendLink(email)
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    const ok = await onVerifyCode(email, code)
    if (ok) onClose()
  }

  if (user) {
    return (
      <Sheet
        title="Account"
        onClose={onClose}
        footer={
          <button
            type="button"
            onClick={async () => {
              await onSignOut()
              onClose()
            }}
            disabled={busy}
            className="glass-well flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[15px] font-semibold text-muted transition active:scale-[0.98] disabled:opacity-50"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        }
      >
        <div className="space-y-4 pb-2">
          <div className="flex items-center gap-3.5 rounded-3xl bg-accent-wash px-4 py-3.5 ring-1 ring-accent/20">
            <span className="accent-fill grid size-11 shrink-0 place-items-center rounded-2xl text-[15px] font-bold text-on-accent">
              {(user.email ?? '?').slice(0, 1).toUpperCase()}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[15px] font-semibold text-ink">
                {user.email}
              </span>
              <span className="block text-[13px] text-accent-ink">
                Synced across your devices
              </span>
            </span>
          </div>
          <p className="text-[13px] leading-relaxed text-muted">
            Signing out keeps a copy of your habits on this device. Sign in again
            on another phone or laptop to pick up where you left off.
          </p>
        </div>
      </Sheet>
    )
  }

  return (
    <Sheet title="Sync your routine" onClose={onClose}>
      <form onSubmit={emailSent ? handleVerify : handleSend} className="space-y-5 pb-2">
        <p className="text-[14px] leading-relaxed text-muted">
          Get a sign-in link by email. Your habits then follow you from phone to
          laptop — no password to remember.
        </p>

        <label className="block">
          <span className="mb-2.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-faint">
            Email
          </span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={emailSent}
            className="glass-well w-full rounded-2xl px-4 py-3.5 text-[16px] text-ink outline-none transition placeholder:text-faint focus:border-accent-hi disabled:opacity-70"
          />
        </label>

        {emailSent && (
          <label className="block">
            <span className="mb-2.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-faint">
              Code from email
            </span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              className="glass-well w-full rounded-2xl px-4 py-3.5 text-[16px] tracking-[0.2em] text-ink outline-none transition placeholder:text-faint focus:border-accent-hi"
            />
            <span className="mt-2 block text-[13px] text-muted">
              Prefer the link? Open it on this device and you’ll be signed in
              automatically.
            </span>
          </label>
        )}

        {error && <p className="text-[13px] text-rose">{error}</p>}

        <button
          type="submit"
          disabled={busy || !email.trim()}
          className="accent-fill flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[15px] font-semibold text-on-accent shadow-glow transition active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
        >
          <Mail className="size-4" />
          {busy
            ? 'Sending…'
            : emailSent
              ? 'Verify code'
              : 'Email me a sign-in link'}
        </button>
      </form>
    </Sheet>
  )
}
