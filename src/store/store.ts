import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Idiom } from '../types'
import { seedIdioms } from '../data/seed'

const DAY = 86_400_000

type Store = {
  idioms: Idiom[]
  streak: number
  lastSessionDate: string
  totalSessions: number

  recordAnswer: (id: string, correct: boolean) => void
  finishSession: () => void
  resetProgress: () => void
  exportData: () => string
  importData: (json: string) => boolean
}

function today() { return new Date().toISOString().slice(0, 10) }

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      idioms: seedIdioms,
      streak: 0,
      lastSessionDate: '',
      totalSessions: 0,

      recordAnswer: (id, correct) => set(s => ({
        idioms: s.idioms.map(i => {
          if (i.id !== id) return i
          const c = correct ? i.correct + 1 : i.correct
          const w = correct ? i.wrong : i.wrong + 1
          let status = i.status
          if (correct) {
            if (status === 'new') status = 'learning'
            if (status === 'learning' && c >= 3) status = 'mastered'
          } else {
            if (status === 'mastered') status = 'learning'
          }
          return { ...i, correct: c, wrong: w, status, lastSeen: Date.now(), nextDue: correct ? Date.now() + c * 2 * DAY : Date.now() + DAY }
        }),
      })),

      finishSession: () => set(s => {
        const t = today()
        const yesterday = new Date(Date.now() - DAY).toISOString().slice(0, 10)
        const continues = s.lastSessionDate === yesterday || s.lastSessionDate === t
        return {
          totalSessions: s.totalSessions + 1,
          lastSessionDate: t,
          streak: continues ? (s.lastSessionDate === t ? s.streak : s.streak + 1) : 1,
        }
      }),

      resetProgress: () => set({
        idioms: seedIdioms.map(i => ({ ...i, status: 'new' as const, correct: 0, wrong: 0, lastSeen: null, nextDue: null })),
        streak: 0, lastSessionDate: '', totalSessions: 0,
      }),

      exportData: () => {
        const { idioms, streak, lastSessionDate, totalSessions } = get()
        return JSON.stringify({ idioms, streak, lastSessionDate, totalSessions }, null, 2)
      },

      importData: (json) => {
        try {
          const d = JSON.parse(json)
          if (!d.idioms) return false
          set({ idioms: d.idioms, streak: d.streak ?? 0, lastSessionDate: d.lastSessionDate ?? '', totalSessions: d.totalSessions ?? 0 })
          return true
        } catch { return false }
      },
    }),
    { name: 'idiom-trainer' },
  ),
)
