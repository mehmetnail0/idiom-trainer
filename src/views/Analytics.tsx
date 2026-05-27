import { useState } from 'react'
import { useStore } from '../store/store'
import { getHeat, daysUntilDue, isPassive } from '../lib/fsrs'
import ItemModal from '../components/ItemModal'
import type { Item } from '../types'

function heatStyle(heat: number): string {
  if (heat === 0) return '#333'
  if (heat < 0.3) return '#665'
  if (heat < 0.6) return '#A97'
  if (heat < 0.9) return '#D93'
  return '#4ADE80'
}

function HeatDot({ heat }: { heat: number }) {
  return <span className="w-3 h-3 rounded-sm inline-block transition-colors duration-500" style={{ background: heatStyle(heat) }} />
}

function StatusLabel({ item }: { item: Item }) {
  const heat = getHeat(item)
  if (isPassive(item)) return <span className="text-[9px] text-correct/40">passive</span>
  if (heat === 0) return <span className="text-[9px] text-text-dim/30">new</span>
  if (heat < 0.3) return <span className="text-[9px] text-text-dim/40">cold</span>
  if (heat < 0.6) return <span className="text-[9px] text-accent/50">warming</span>
  if (heat < 0.9) return <span className="text-[9px] text-accent/70">warm</span>
  return <span className="text-[9px] text-correct/60">hot</span>
}

export default function Analytics() {
  const { items, stats, streak } = useStore()
  const [selected, setSelected] = useState<Item | null>(null)

  const activeItems = items.filter(i => !i.archived)
  const archivedItems = items.filter(i => i.archived)
  const heats = activeItems.map(i => getHeat(i))
  const avgHeat = heats.length > 0 ? Math.round(heats.reduce((a, b) => a + b, 0) / heats.length * 100) : 0

  const cold = activeItems.filter(i => getHeat(i) === 0).length
  const warming = activeItems.filter(i => { const h = getHeat(i); return h > 0 && h < 0.5 }).length
  const warm = activeItems.filter(i => { const h = getHeat(i); return h >= 0.5 && h < 0.9 }).length
  const hot = activeItems.filter(i => getHeat(i) >= 0.9).length
  const passive = activeItems.filter(i => isPassive(i)).length

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86_400_000)
    const key = d.toISOString().slice(0, 10)
    const day = d.toLocaleDateString('en', { weekday: 'short' }).slice(0, 2)
    const s = stats.find(s => s.date === key)
    return { day, reviewed: s?.reviewed ?? 0, correct: s?.correct ?? 0 }
  })
  const maxReviewed = Math.max(1, ...last7.map(d => d.reviewed))

  const idioms = activeItems.filter(i => i.type === 'idiom')
  const words = activeItems.filter(i => i.type === 'word')
  const totalReviews = stats.reduce((a, s) => a + s.reviewed, 0)
  const totalCorrect = stats.reduce((a, s) => a + s.correct, 0)

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Analytics</h2>
        <p className="text-[10px] text-text-dim/40 mt-1">Progress & heat overview</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { n: `${avgHeat}%`, l: 'avg heat' },
          { n: streak, l: 'streak' },
          { n: activeItems.length, l: 'active' },
        ].map(s => (
          <div key={s.l} className="rounded-lg p-3 text-center border border-border/20 bg-card/50">
            <div className="text-lg font-semibold text-text/70">{s.n}</div>
            <div className="text-[9px] text-text-dim/30 uppercase tracking-wider">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Heat distribution */}
      <div className="rounded-lg p-4 border border-border/20 bg-card/30 space-y-3">
        <p className="text-[10px] text-text-dim/40 uppercase tracking-wider">Heat distribution</p>
        <div className="flex gap-1 items-end h-8">
          {[
            { count: cold, color: '#333', label: 'new' },
            { count: warming, color: '#886', label: 'warming' },
            { count: warm, color: '#C93', label: 'warm' },
            { count: hot, color: '#4ADE80', label: 'hot' },
            { count: passive, color: '#4ADE8066', label: 'passive' },
          ].map(b => (
            <div key={b.label} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-sm transition-all duration-500"
                style={{ height: `${Math.max(2, (b.count / activeItems.length) * 32)}px`, background: b.color }} />
              <span className="text-[8px] text-text-dim/30">{b.count}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[8px] text-text-dim/20">
          <span>new</span><span>warming</span><span>warm</span><span>hot</span><span>passive</span>
        </div>
      </div>

      {/* Week activity */}
      <div className="rounded-lg p-4 border border-border/20 bg-card/30 space-y-3">
        <p className="text-[10px] text-text-dim/40 uppercase tracking-wider">Last 7 days</p>
        <div className="flex gap-1 items-end h-12">
          {last7.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-sm bg-accent/40 transition-all duration-500"
                style={{ height: `${Math.max(2, (d.reviewed / maxReviewed) * 48)}px` }} />
              <span className="text-[8px] text-text-dim/30">{d.day}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-text-dim/30">
          <span>{totalReviews} total reviews</span>
          <span>{totalCorrect > 0 ? Math.round(totalCorrect / totalReviews * 100) : 0}% accuracy</span>
        </div>
      </div>

      {/* All items */}
      <div className="rounded-lg border border-border/20 bg-card/30 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border/15">
          <p className="text-[10px] text-text-dim/40 uppercase tracking-wider">
            All items · {idioms.length} idioms · {words.length} words{archivedItems.length > 0 ? ` · ${archivedItems.length} archived` : ''}
          </p>
        </div>
        <div className="divide-y divide-border/10">
          {activeItems.map(item => {
            const heat = getHeat(item)
            const due = daysUntilDue(item)
            return (
              <button key={item.id} onClick={() => setSelected(item)}
                className="w-full text-left px-4 py-2.5 hover:bg-card-hover transition-colors flex items-center gap-3">
                <HeatDot heat={heat} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] text-text/70 truncate">{item.phrase}</span>
                    {item.type === 'word' && <span className="text-[8px] text-text-dim/25 uppercase">w</span>}
                  </div>
                  <p className="text-[10px] text-text-dim/30 italic truncate">{item.meaning}</p>
                </div>
                <div className="flex flex-col items-end gap-0.5 shrink-0">
                  <StatusLabel item={item} />
                  <span className="text-[8px] text-text-dim/20">
                    {item.reps}r · {due !== null ? (due === 0 ? 'due' : `${due}d`) : 'new'}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {selected && <ItemModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
