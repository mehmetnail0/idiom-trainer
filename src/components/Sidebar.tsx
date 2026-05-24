import { useState } from 'react'
import type { Item } from '../types'
import { getHeat, isPassive } from '../lib/fsrs'
import ItemModal from './ItemModal'

function heatDot(heat: number): string {
  if (heat === 0) return 'bg-[#333]'
  if (heat < 0.3) return 'bg-[#555]'
  if (heat < 0.5) return 'bg-[#8B7355]'
  if (heat < 0.75) return 'bg-accent'
  return 'bg-correct'
}

function Row({ item, onClick }: { item: Item; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full text-left px-4 py-2 hover:bg-card-hover transition-colors">
      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${heatDot(getHeat(item))}`} />
        <span className="text-[13px] text-text/80 truncate">{item.phrase}</span>
        {item.type === 'word' && <span className="text-[9px] text-text-dim/40 ml-auto uppercase">w</span>}
      </div>
      <p className="text-[10px] text-text-dim/40 italic ml-4 mt-0.5 truncate leading-snug">{item.examples[0]}</p>
    </button>
  )
}

export default function Sidebar({ items }: { items: Item[] }) {
  const [selected, setSelected] = useState<Item | null>(null)
  const [showPassive, setShowPassive] = useState(false)

  const active = items.filter(i => !isPassive(i))
  const passive = items.filter(i => isPassive(i))

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b border-border/50 shrink-0">
          <p className="text-[11px] text-text-dim uppercase tracking-[0.15em]">Library</p>
          <p className="text-[10px] text-text-dim/50 mt-0.5">{active.length} active{passive.length > 0 ? ` · ${passive.length} passive` : ''}</p>
        </div>

        <div className="overflow-y-auto flex-1 divide-y divide-border/20">
          {active.map(item => <Row key={item.id} item={item} onClick={() => setSelected(item)} />)}

          {passive.length > 0 && (
            <>
              <button onClick={() => setShowPassive(!showPassive)}
                className="w-full text-left px-4 py-2 text-[10px] text-text-dim/40 hover:text-text-dim transition-colors uppercase tracking-wider">
                {showPassive ? '▾' : '▸'} passive ({passive.length})
              </button>
              {showPassive && passive.map(item => <Row key={item.id} item={item} onClick={() => setSelected(item)} />)}
            </>
          )}
        </div>
      </div>
      {selected && <ItemModal item={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
