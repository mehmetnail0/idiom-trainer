import { useState } from 'react'
import type { Item } from '../types'
import { getHeat } from '../lib/fsrs'
import ItemModal from './ItemModal'

function heatColor(heat: number): string {
  if (heat === 0) return 'bg-[#3B3F51]'
  if (heat < 0.3) return 'bg-[#555B6E]'
  if (heat < 0.5) return 'bg-[#D4A843]'
  if (heat < 0.75) return 'bg-[#E8943A]'
  return 'bg-correct'
}

function isPassive(item: Item): boolean {
  return item.stability >= 30
}

function ItemRow({ item, onClick }: { item: Item; onClick: () => void }) {
  const heat = getHeat(item)
  return (
    <button onClick={onClick} className="w-full text-left px-4 py-2.5 hover:bg-card-hover transition-colors border-b border-border/50">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full shrink-0 ${heatColor(heat)}`} />
        <span className="text-sm truncate">{item.phrase}</span>
        {item.type === 'word' && <span className="text-[10px] text-text-dim/50 ml-auto">word</span>}
      </div>
      <p className="text-[11px] text-text-dim italic ml-4 mt-0.5 truncate opacity-50">{item.examples[0]}</p>
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
      <div className="bg-card border-border overflow-hidden flex flex-col h-full">
        <div className="px-4 py-3 border-b border-border shrink-0">
          <h3 className="text-sm font-semibold">Library ({items.length})</h3>
          <div className="flex gap-3 mt-1 text-xs text-text-dim">
            <span>{active.length} active</span>
            {passive.length > 0 && <span>{passive.length} passive</span>}
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {active.map(item => (
            <ItemRow key={item.id} item={item} onClick={() => setSelected(item)} />
          ))}

          {passive.length > 0 && (
            <>
              <button onClick={() => setShowPassive(!showPassive)}
                className="w-full text-left px-4 py-2 text-xs text-text-dim hover:bg-card-hover border-b border-border/50">
                {showPassive ? '▾' : '▸'} Passive ({passive.length})
              </button>
              {showPassive && passive.map(item => (
                <ItemRow key={item.id} item={item} onClick={() => setSelected(item)} />
              ))}
            </>
          )}
        </div>
      </div>
      {selected && <ItemModal item={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
