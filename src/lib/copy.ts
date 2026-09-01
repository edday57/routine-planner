export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function getEncouragement(completed: number, total: number): string {
  if (total === 0) return 'Add habits to get started'
  if (completed === 0) return 'One step at a time'
  if (completed < total) return 'You’re making progress'
  return 'All done for today — well done!'
}
