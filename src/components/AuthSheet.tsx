import { useState } from 'react'
import { KeyRound, LogOut, Mail } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import { isStandaloneApp, rememberedEmail } from '../lib/device'
import { Sheet } from './Sheet'

interface AuthSheetProps {
  user: User | null
  busy: boolean
  error: string | null
  emailSent: boolean
  onSendCode: (email: string) => Promise<boolean>
  onVerifyCode: (email: string, token: string) => Promise<boolean>
  onSignOut: () => Promise<void>
  onClose: () => void
}

export function AuthSheet({
  user,
  busy,
  error,
  emailSent,
  onSendCode,
  onVerifyCode,
  onSignOut,
  onClose,
}: AuthSheetProps) {
  const [email, setEmail] = useState(user?.email ?? rememberedEmail())
  const [code, setCode] = useState('')
  const standalone = isStandaloneApp()

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    await onSendCode(email)
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
                Safari and the home-screen app now share this routine
              </span>
            </span>
          </div>
          <p className="text-[13px] leading-relaxed text-muted">
            On iPhone, Safari and Add to Home Screen keep separate local copies.
            Staying signed in is what keeps ticks and habits in one place.
          </p>
        </div>
      </Sheet>
    )
  }

  return (
    <Sheet title="Keep this in sync" onClose={onClose}>
      <form onSubmit={emailSent ? handleVerify : handleSend} className="space-y-5 pb-2">
        <p className="text-[14px] leading-relaxed text-muted">
          {standalone
            ? 'The home-screen app cannot open email links. We’ll send a 6-digit code — type it here and stay in the app.'
            : 'We’ll email a 6-digit code. Type it here. Skip the link if you also use the home-screen app — that link only signs in Safari.'}
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
              6-digit code
            </span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
              placeholder="123456"
              className="glass-well w-full rounded-2xl px-4 py-3.5 text-center text-[22px] font-semibold tracking-[0.28em] text-ink outline-none transition placeholder:text-faint focus:border-accent-hi"
            />
            <button
              type="button"
              onClick={() => onSendCode(email)}
              disabled={busy}
              className="mt-2 text-[13px] font-semibold text-accent-ink disabled:opacity-50"
            >
              Send a new code
            </button>
          </label>
        )}

        {error && <p className="text-[13px] text-rose">{error}</p>}

        <button
          type="submit"
          disabled={busy || !email.trim() || (emailSent && code.length < 6)}
          className="accent-fill flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[15px] font-semibold text-on-accent shadow-glow transition active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
        >
          {emailSent ? <KeyRound className="size-4" /> : <Mail className="size-4" />}
          {busy
            ? emailSent
              ? 'Checking…'
              : 'Sending…'
            : emailSent
              ? 'Sign in with code'
              : 'Email me a code'}
        </button>
      </form>
    </Sheet>
  )
}
