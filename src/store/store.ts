import { create } from 'zustand'
import type { Item, DayStats } from '../types'
import { seedItems } from '../data/seed'
import { nextReview } from '../lib/fsrs'

const KEY = 'idiom-trainer-data'

type Persisted = {
  items: Item[]
  stats: DayStats[]
  lastSaved: number
}

function loadFromStorage(): Persisted | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (data?.state) return data.state as Persisted
    if (data?.items) return data as Persisted
    return null
  } catch { return null }
}

function saveToStorage(data: Persisted) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

function getInitialState(): Persisted {
  const saved = loadFromStorage()
  if (saved && saved.items && saved.items.length > 0) return saved
  return { items: seedItems, stats: [], lastSaved: 0 }
}

function today() { return new Date().toISOString().slice(0, 10) }

function calcStreak(stats: DayStats[]): number {
  if (stats.length === 0) return 0
  const sorted = [...stats].sort((a, b) => b.date.localeCompare(a.date))
  let streak = 0
  const d = new Date()
  for (const s of sorted) {
    const expected = d.toISOString().slice(0, 10)
    if (s.date === expected && s.reviewed > 0) { streak++; d.setDate(d.getDate() - 1) }
    else if (s.date < expected) break
  }
  return streak
}

type Store = {
  items: Item[]
  stats: DayStats[]
  streak: number
  lastSaved: number

  rate: (id: string, rating: 1 | 3 | 4) => void
  addItem: (item: Omit<Item, 'stability' | 'difficulty' | 'reps' | 'lastReview' | 'nextDue'>) => void
  resetProgress: () => void
  exportData: () => string
  importData: (json: string) => boolean
  todayStats: () => DayStats
}

const init = getInitialState()

export const useStore = create<Store>()((set, get) => ({
  items: init.items,
  stats: init.stats,
  streak: calcStreak(init.stats),
  lastSaved: init.lastSaved,

  rate: (id, rating) => {
    const t = today()
    set(s => {
      const item = s.items.find(i => i.id === id)
      if (!item) return s

      const update = nextReview(item, rating)
      const isNew = item.reps === 0

      let dayStats = s.stats.find(d => d.date === t)
      const otherStats = s.stats.filter(d => d.date !== t)
      if (!dayStats) dayStats = { date: t, reviewed: 0, correct: 0, newLearned: 0 }
      dayStats = {
        ...dayStats,
        reviewed: dayStats.reviewed + 1,
        correct: dayStats.correct + (rating >= 3 ? 1 : 0),
        newLearned: dayStats.newLearned + (isNew ? 1 : 0),
      }
      const newStats = [...otherStats, dayStats]
      const newItems = s.items.map(i => i.id === id ? { ...i, ...update } : i)
      const now = Date.now()

      saveToStorage({ items: newItems, stats: newStats, lastSaved: now })

      return { items: newItems, stats: newStats, streak: calcStreak(newStats), lastSaved: now }
    })
  },

  addItem: (data) => {
    set(s => {
      const newItems = [...s.items, { ...data, stability: 0, difficulty: 5, reps: 0, lastReview: null, nextDue: null }]
      const now = Date.now()
      saveToStorage({ items: newItems, stats: s.stats, lastSaved: now })
      return { items: newItems, lastSaved: now }
    })
  },

  resetProgress: () => {
    const newItems = get().items.map(i => ({ ...i, stability: 0, difficulty: 5, reps: 0, lastReview: null, nextDue: null }))
    const now = Date.now()
    saveToStorage({ items: newItems, stats: [], lastSaved: now })
    set({ items: newItems, stats: [], streak: 0, lastSaved: now })
  },

  exportData: () => JSON.stringify({ items: get().items, stats: get().stats }, null, 2),

  importData: (json) => {
    try {
      const d = JSON.parse(json)
      if (!d.items) return false
      const now = Date.now()
      saveToStorage({ items: d.items, stats: d.stats ?? [], lastSaved: now })
      set({ items: d.items, stats: d.stats ?? [], streak: calcStreak(d.stats ?? []), lastSaved: now })
      return true
    } catch { return false }
  },

  todayStats: () => {
    const t = today()
    return get().stats.find(d => d.date === t) ?? { date: t, reviewed: 0, correct: 0, newLearned: 0 }
  },
}))
