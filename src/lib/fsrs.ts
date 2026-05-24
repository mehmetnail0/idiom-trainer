import type { Item } from '../types'

const DAY = 86_400_000

export function nextReview(item: Item, rating: 1 | 3 | 4): Pick<Item, 'stability' | 'difficulty' | 'reps' | 'lastReview' | 'nextDue'> {
  const now = Date.now()

  if (rating === 1) {
    return { stability: 1, difficulty: Math.min(10, item.difficulty + 1), reps: 0, lastReview: now, nextDue: now + DAY }
  }

  const mult = rating === 4 ? 3.2 : 2.5
  const diffFactor = 1 - (item.difficulty - 5) * 0.05
  const base = item.stability === 0 ? 1 : item.stability
  const newStab = Math.max(1, Math.round(base * mult * diffFactor * 10) / 10)
  const newDiff = rating === 4 ? Math.max(1, item.difficulty - 0.5) : item.difficulty

  return { stability: newStab, difficulty: newDiff, reps: item.reps + 1, lastReview: now, nextDue: now + Math.round(newStab) * DAY }
}

export function getHeat(item: Item): number {
  if (item.reps === 0) return 0
  const daysSince = item.lastReview ? (Date.now() - item.lastReview) / DAY : 999
  const recency = Math.max(0, 1 - daysSince / (item.stability || 7))
  const strength = Math.min(1, item.reps / 6)
  return Math.round((recency * 0.4 + strength * 0.6) * 100) / 100
}

export function isPassive(item: Item): boolean {
  return item.stability >= 30
}

export function isDue(item: Item): boolean {
  if (!item.nextDue) return true
  return Date.now() >= item.nextDue
}

export function buildQueue(items: Item[]): string[] {
  const due = items.filter(i => i.reps > 0 && isDue(i)).sort((a, b) => (a.nextDue ?? 0) - (b.nextDue ?? 0))
  const fresh = items.filter(i => i.reps === 0)

  const ids: string[] = []
  let ri = 0, fi = 0
  while (ri < due.length || fi < fresh.length) {
    if (ri < due.length) ids.push(due[ri++].id)
    if (ri < due.length) ids.push(due[ri++].id)
    if (fi < fresh.length) ids.push(fresh[fi++].id)
  }
  return ids
}

export function daysUntilDue(item: Item): number | null {
  if (!item.nextDue) return null
  return Math.max(0, Math.ceil((item.nextDue - Date.now()) / DAY))
}

export function nextDueDate(items: Item[]): string | null {
  const notDue = items.filter(i => i.nextDue && i.nextDue > Date.now())
  if (notDue.length === 0) return null
  const earliest = Math.min(...notDue.map(i => i.nextDue!))
  const hours = Math.ceil((earliest - Date.now()) / 3_600_000)
  if (hours < 24) return `${hours}h`
  return `${Math.ceil(hours / 24)}d`
}
