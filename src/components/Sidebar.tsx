import { useState } from 'react'
import type { Item } from '../types'
import { getHeat, isPassive, daysUntilDue } from '../lib/fsrs'
import { useStore } from '../store/store'
import ItemModal from './ItemModal'

function heatStyle(heat: number): string {
  if (heat === 0) return '#333'
  if (heat < 0.15) return '#444'
  if (heat < 0.3) return '#665'
  if (heat < 0.45) return '#886'
  if (heat < 0.6) return '#A97'
  if (heat < 0.75) return '#C93'
  if (heat < 0.9) return '#D93'
  return '#4ADE80'
}

function HeatBar({ heat }: { heat: number }) {
  return (
    <div className="w-8 h-1 rounded-full bg-border/30 overflow-hidden shrink-0">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.max(5, heat * 100)}%`, background: heatStyle(heat) }} />
    </div>
  )
}

function Row({ item, onClick }: { item: Item; onClick: () => void }) {
  const heat = getHeat(item)
  const due = daysUntilDue(item)
  return (
    <button onClick={onClick} className="w-full text-left px-4 py-2.5 hover:bg-card-hover transition-colors group">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-500" style={{ background: heatStyle(heat) }} />
        <span className="text-[13px] text-text/70 truncate flex-1">{item.phrase}</span>
        <HeatBar heat={heat} />
      </div>
      <div className="flex items-center gap-2 ml-4 mt-0.5">
        <p className="text-[10px] text-text-dim/30 italic truncate flex-1">{item.examples[0]}</p>
        {due !== null && due > 0 && <span className="text-[9px] text-text-dim/20 shrink-0">{due}d</span>}
      </div>
    </button>
  )
}

export default function Sidebar({ items }: { items: Item[] }) {
  const [selected, setSelected] = useState<Item | null>(null)
  const [showPassive, setShowPassive] = useState(false)
  const [showArchived, setShowArchived] = useState(false)
  const { unarchiveItem } = useStore()

  const nonArchived = items.filter(i => !i.archived)
  const active = nonArchived.filter(i => !isPassive(i))
  const passive = nonArchived.filter(i => isPassive(i))
  const archived = items.filter(i => i.archived)

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b border-border/30 shrink-0">
          <p className="text-[11px] text-text-dim/60 uppercase tracking-[0.15em]">Library</p>
          <p className="text-[10px] text-text-dim/30 mt-0.5">{active.length} active{passive.length > 0 ? ` · ${passive.length} passive` : ''}{archived.length > 0 ? ` · ${archived.length} archived` : ''}</p>
        </div>

        <div className="overflow-y-auto flex-1 divide-y divide-border/10">
          {active.map(item => <Row key={item.id} item={item} onClick={() => setSelected(item)} />)}

          {passive.length > 0 && (
            <>
              <button onClick={() => setShowPassive(!showPassive)}
                className="w-full text-left px-4 py-2 text-[10px] text-text-dim/30 hover:text-text-dim/50 transition-colors uppercase tracking-wider">
                {showPassive ? '▾' : '▸'} passive ({passive.length})
              </button>
              {showPassive && passive.map(item => <Row key={item.id} item={item} onClick={() => setSelected(item)} />)}
            </>
          )}

          {archived.length > 0 && (
            <>
              <button onClick={() => setShowArchived(!showArchived)}
                className="w-full text-left px-4 py-2 text-[10px] text-text-dim/30 hover:text-text-dim/50 transition-colors uppercase tracking-wider">
                {showArchived ? '▾' : '▸'} archived ({archived.length})
              </button>
              {showArchived && archived.map(item => (
                <div key={item.id} className="flex items-center group">
                  <button onClick={() => setSelected(item)} className="flex-1 text-left px-4 py-2.5 hover:bg-card-hover transition-colors min-w-0">
                    <span className="text-[13px] text-text-dim/40 truncate block">{item.phrase}</span>
                  </button>
                  <button onClick={() => unarchiveItem(item.id)} className="px-2 py-1 mr-2 text-[9px] text-accent/50 hover:text-accent opacity-0 group-hover:opacity-100 transition-opacity" title="Restore">
                    ↩
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      {selected && <ItemModal item={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
