import { create } from 'zustand'
import type { Item, DayStats } from '../types'
import { seedItems } from '../data/seed'
import { nextReview } from '../lib/fsrs'
import { saveProgress, loadProgress } from '../lib/supabase'

const LOCAL_KEY = 'idiom-trainer-data'

type Persisted = { items: Item[]; stats: DayStats[]; lastSaved: number }

function mergeWithSeed(saved: Item[]): Item[] {
  const existing = new Set(saved.map(i => i.id))
  const newFromSeed = seedItems.filter(s => !existing.has(s.id))
  return [...saved, ...newFromSeed]
}

function readLocal(): Persisted | null {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (!raw) return null
    const d = JSON.parse(raw)
    const data = d?.state?.items ? d.state : d?.items ? d : null
    if (!data) return null
    data.items = mergeWithSeed(data.items)
    return data
  } catch { return null }
}

function writeLocal(data: Persisted) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data))
}

async function writeCloud(data: Persisted) {
  const ok = await saveProgress(data)
  if (!ok) console.warn('[idiom-trainer] cloud save failed — local backup intact')
}

function persist(data: Persisted) {
  writeLocal(data)
  writeCloud(data)
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
  cloudStatus: 'idle' | 'saving' | 'saved' | 'error'

  rate: (id: string, rating: 1 | 3 | 4) => void
  addItem: (item: Omit<Item, 'stability' | 'difficulty' | 'reps' | 'lastReview' | 'nextDue'>) => void
  archiveItem: (id: string) => void
  unarchiveItem: (id: string) => void
  resetProgress: () => void
  exportData: () => string
  importData: (json: string) => boolean
  todayStats: () => DayStats
  syncFromCloud: () => Promise<void>
}

const local = readLocal()
const init: Persisted = local && local.items?.length > 0
  ? local
  : { items: seedItems, stats: [], lastSaved: 0 }

export const useStore = create<Store>()((set, get) => ({
  items: init.items,
  stats: init.stats,
  streak: calcStreak(init.stats),
  lastSaved: init.lastSaved,
  cloudStatus: 'idle',

  rate: (id, rating) => {
    const t = today()
    set(s => {
      const item = s.items.find(i => i.id === id)
      if (!item) return s

      const reviewedToday = item.lastReview != null && new Date(item.lastReview).toISOString().slice(0, 10) === t

      let dayStats = s.stats.find(d => d.date === t)
      const otherStats = s.stats.filter(d => d.date !== t)
      if (!dayStats) dayStats = { date: t, reviewed: 0, correct: 0, newLearned: 0 }

      if (reviewedToday && rating >= 3) {
        dayStats = { ...dayStats, reviewed: dayStats.reviewed + 1, correct: dayStats.correct + 1 }
        const newStats = [...otherStats, dayStats]
        const now = Date.now()
        persist({ items: s.items, stats: newStats, lastSaved: now })
        return { stats: newStats, streak: calcStreak(newStats), lastSaved: now }
      }

      const update = nextReview(item, rating)
      const prevReviewDate = item.lastReview ? new Date(item.lastReview).toISOString().slice(0, 10) : null
      const alreadyCountedToday = prevReviewDate === t
      const newCorrectCount = rating >= 3 ? (item.correctCount ?? 0) + (alreadyCountedToday ? 0 : 1) : 0
      const shouldArchive = newCorrectCount >= 7
      Object.assign(update, { correctCount: newCorrectCount, archived: shouldArchive || !!item.archived })
      const isNew = item.reps === 0

      dayStats = { ...dayStats, reviewed: dayStats.reviewed + 1, correct: dayStats.correct + (rating >= 3 ? 1 : 0), newLearned: dayStats.newLearned + (isNew ? 1 : 0) }
      const newStats = [...otherStats, dayStats]
      const newItems = s.items.map(i => i.id === id ? { ...i, ...update } : i)
      const now = Date.now()

      persist({ items: newItems, stats: newStats, lastSaved: now })

      return { items: newItems, stats: newStats, streak: calcStreak(newStats), lastSaved: now }
    })
  },

  addItem: (data) => set(s => {
    const newItems = [...s.items, { ...data, stability: 0, difficulty: 5, reps: 0, lastReview: null, nextDue: null, correctCount: 0, archived: false }]
    const now = Date.now()
    persist({ items: newItems, stats: s.stats, lastSaved: now })
    return { items: newItems, lastSaved: now }
  }),

  archiveItem: (id) => set(s => {
    const newItems = s.items.map(i => i.id === id ? { ...i, archived: true } : i)
    const now = Date.now()
    persist({ items: newItems, stats: s.stats, lastSaved: now })
    return { items: newItems, lastSaved: now }
  }),

  unarchiveItem: (id) => set(s => {
    const newItems = s.items.map(i => i.id === id ? { ...i, archived: false, correctCount: 0 } : i)
    const now = Date.now()
    persist({ items: newItems, stats: s.stats, lastSaved: now })
    return { items: newItems, lastSaved: now }
  }),

  resetProgress: () => {
    const newItems = get().items.map(i => ({ ...i, stability: 0, difficulty: 5, reps: 0, lastReview: null, nextDue: null }))
    const now = Date.now()
    persist({ items: newItems, stats: [], lastSaved: now })
    set({ items: newItems, stats: [], streak: 0, lastSaved: now })
  },

  exportData: () => JSON.stringify({ items: get().items, stats: get().stats }, null, 2),

  importData: (json) => {
    try {
      const d = JSON.parse(json)
      if (!d.items) return false
      const now = Date.now()
      persist({ items: d.items, stats: d.stats ?? [], lastSaved: now })
      set({ items: d.items, stats: d.stats ?? [], streak: calcStreak(d.stats ?? []), lastSaved: now })
      return true
    } catch { return false }
  },

  todayStats: () => {
    const t = today()
    return get().stats.find(d => d.date === t) ?? { date: t, reviewed: 0, correct: 0, newLearned: 0 }
  },

  syncFromCloud: async () => {
    const cloud = await loadProgress()
    if (!cloud || !cloud.items) return
    if (cloud.lastSaved > get().lastSaved) {
      const merged = mergeWithSeed(cloud.items as Item[])
      writeLocal({ items: merged, stats: cloud.stats as DayStats[], lastSaved: cloud.lastSaved })
      set({ items: merged, stats: cloud.stats as DayStats[], streak: calcStreak(cloud.stats as DayStats[]), lastSaved: cloud.lastSaved })
    }
  },
}))

useStore.getState().syncFromCloud()
