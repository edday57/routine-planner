import { useCallback, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { isStandaloneApp, rememberEmail } from '../lib/device'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(!isSupabaseConfigured)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)

  useEffect(() => {
    if (!supabase) return

    let cancelled = false

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return
      setUser(data.session?.user ?? null)
      setReady(true)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setReady(true)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  const sendCode = useCallback(async (email: string) => {
    if (!supabase) {
      setError('Supabase is not configured.')
      return false
    }

    setBusy(true)
    setError(null)

    const trimmed = email.trim()
    rememberEmail(trimmed)

    // Home-screen apps on iOS cannot finish a magic-link login: Mail opens
    // Safari, which has a separate cookie jar. Ask for an OTP email instead
    // and keep the session inside this webview.
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        shouldCreateUser: true,
        // Only attach a redirect when we are in a normal browser tab.
        ...(isStandaloneApp() ? {} : { emailRedirectTo: undefined }),
      },
    })

    setBusy(false)

    if (signInError) {
      setError(signInError.message)
      return false
    }

    setEmailSent(true)
    return true
  }, [])

  const verifyCode = useCallback(async (email: string, token: string) => {
    if (!supabase) {
      setError('Supabase is not configured.')
      return false
    }

    setBusy(true)
    setError(null)

    const trimmedEmail = email.trim()
    const trimmedToken = token.replace(/\s+/g, '')

    const emailAttempt = await supabase.auth.verifyOtp({
      email: trimmedEmail,
      token: trimmedToken,
      type: 'email',
    })

    if (!emailAttempt.error) {
      setBusy(false)
      return true
    }

    const signupAttempt = await supabase.auth.verifyOtp({
      email: trimmedEmail,
      token: trimmedToken,
      type: 'signup',
    })

    setBusy(false)

    if (signupAttempt.error) {
      setError(signupAttempt.error.message)
      return false
    }

    return true
  }, [])

  const signOut = useCallback(async () => {
    if (!supabase) return
    setBusy(true)
    await supabase.auth.signOut()
    setBusy(false)
    setEmailSent(false)
  }, [])

  const resetForm = useCallback(() => {
    setError(null)
    setEmailSent(false)
  }, [])

  return {
    user,
    ready,
    busy,
    error,
    emailSent,
    configured: isSupabaseConfigured,
    sendCode,
    verifyCode,
    signOut,
    resetForm,
  }
}
