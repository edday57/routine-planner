export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function getEncouragement(completed: number, total: number): string {
  if (total === 0) return 'Nothing on the list today'
  if (completed === 0) return 'Start with the easiest one'
  if (completed === total) return 'Every habit done today'
  if (completed / total >= 0.6) return 'Almost there'
  return 'Good start — keep the momentum'
}
