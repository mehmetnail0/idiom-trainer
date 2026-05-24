import type { Item, Rating } from '../types'

const DAY = 86_400_000

export function nextReview(item: Item, rating: Rating): Pick<Item, 'stability' | 'difficulty' | 'reps' | 'lastReview' | 'nextDue'> {
  const now = Date.now()

  if (rating === 1) {
    return {
      stability: 1,
      difficulty: Math.min(10, item.difficulty + 1),
      reps: 0,
      lastReview: now,
      nextDue: now + DAY,
    }
  }

  const newReps = item.reps + 1
  let multiplier: number
  switch (rating) {
    case 2: multiplier = 1.2; break  // Hard
    case 3: multiplier = 2.5; break  // Good
    case 4: multiplier = 3.2; break  // Easy
  }

  const diffFactor = 1 - (item.difficulty - 5) * 0.05
  const baseStability = item.stability === 0 ? 1 : item.stability
  const newStability = Math.max(1, baseStability * multiplier * diffFactor)

  const newDifficulty = rating === 4
    ? Math.max(1, item.difficulty - 0.5)
    : rating === 2
      ? Math.min(10, item.difficulty + 0.5)
      : item.difficulty

  return {
    stability: Math.round(newStability * 10) / 10,
    difficulty: Math.round(newDifficulty * 10) / 10,
    reps: newReps,
    lastReview: now,
    nextDue: now + Math.round(newStability) * DAY,
  }
}

export function getHeat(item: Item): number {
  if (item.reps === 0) return 0
  const daysSince = item.lastReview ? (Date.now() - item.lastReview) / DAY : 999
  const recency = Math.max(0, 1 - daysSince / (item.stability || 7))
  const strength = Math.min(1, item.reps / 6)
  return Math.round((recency * 0.4 + strength * 0.6) * 100) / 100
}

export function isDue(item: Item): boolean {
  if (!item.nextDue) return true
  return Date.now() >= item.nextDue
}

export function buildQueue(items: Item[], maxNew: number, maxReview: number): string[] {
  const due = items.filter(i => i.reps > 0 && isDue(i)).sort((a, b) => (a.nextDue ?? 0) - (b.nextDue ?? 0))
  const fresh = items.filter(i => i.reps === 0).slice(0, maxNew)
  const reviews = due.slice(0, maxReview)

  const ids: string[] = []
  let ri = 0, fi = 0
  while (ri < reviews.length || fi < fresh.length) {
    if (ri < reviews.length) { ids.push(reviews[ri].id); ri++ }
    if (ri < reviews.length) { ids.push(reviews[ri].id); ri++ }
    if (fi < fresh.length) { ids.push(fresh[fi].id); fi++ }
  }
  return ids
}

export function daysUntilDue(item: Item): number | null {
  if (!item.nextDue) return null
  return Math.max(0, Math.ceil((item.nextDue - Date.now()) / DAY))
}
