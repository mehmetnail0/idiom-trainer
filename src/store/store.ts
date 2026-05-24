import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Item, DayStats } from '../types'
import { seedItems } from '../data/seed'
import { nextReview } from '../lib/fsrs'

const STORE_KEY = 'idiom-trainer-data'

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

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      items: seedItems,
      stats: [],
      streak: 0,
      lastSaved: 0,

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

          return {
            items: s.items.map(i => i.id === id ? { ...i, ...update } : i),
            stats: newStats,
            streak: calcStreak(newStats),
            lastSaved: Date.now(),
          }
        })
      },

      addItem: (data) => set(s => ({
        items: [...s.items, { ...data, stability: 0, difficulty: 5, reps: 0, lastReview: null, nextDue: null }],
        lastSaved: Date.now(),
      })),

      resetProgress: () => set({
        items: get().items.map(i => ({ ...i, stability: 0, difficulty: 5, reps: 0, lastReview: null, nextDue: null })),
        stats: [], streak: 0, lastSaved: Date.now(),
      }),

      exportData: () => JSON.stringify({ items: get().items, stats: get().stats }, null, 2),

      importData: (json) => {
        try {
          const d = JSON.parse(json)
          if (!d.items) return false
          set({ items: d.items, stats: d.stats ?? [], streak: calcStreak(d.stats ?? []), lastSaved: Date.now() })
          return true
        } catch { return false }
      },

      todayStats: () => {
        const t = today()
        return get().stats.find(d => d.date === t) ?? { date: t, reviewed: 0, correct: 0, newLearned: 0 }
      },
    }),
    {
      name: STORE_KEY,
      partialize: (state) => ({
        items: state.items,
        stats: state.stats,
        streak: state.streak,
        lastSaved: state.lastSaved,
      }),
      merge: (persisted, current) => {
        const p = persisted as Partial<Store> | undefined
        if (!p || !p.items || p.items.length === 0) return current
        return { ...current, ...p }
      },
    },
  ),
)
