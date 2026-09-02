const EMAIL_KEY = 'routine-auth-email'

export function isStandaloneApp(): boolean {
  if (typeof window === 'undefined') return false
  const media = window.matchMedia('(display-mode: standalone)').matches
  const ios = 'standalone' in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
  return media || ios
}

export function rememberEmail(email: string): void {
  localStorage.setItem(EMAIL_KEY, email.trim())
}

export function rememberedEmail(): string {
  return localStorage.getItem(EMAIL_KEY) ?? ''
}

export async function requestPersistentStorage(): Promise<void> {
  try {
    if (navigator.storage?.persist) {
      await navigator.storage.persist()
    }
  } catch {
    // Safari may reject this; cloud sync is the real persistence.
  }
}
