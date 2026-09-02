import { useCallback, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { authRedirectTo, isSupabaseConfigured, supabase } from '../lib/supabase'

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

  const sendMagicLink = useCallback(async (email: string) => {
    if (!supabase) {
      setError('Supabase is not configured.')
      return false
    }

    setBusy(true)
    setError(null)

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
        emailRedirectTo: authRedirectTo(),
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

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: token.trim(),
      type: 'email',
    })

    setBusy(false)

    if (verifyError) {
      setError(verifyError.message)
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
    sendMagicLink,
    verifyCode,
    signOut,
    resetForm,
  }
}
