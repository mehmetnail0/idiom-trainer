import { useState } from 'react'
import type { Item } from '../types'
import { getHeat } from '../lib/fsrs'
import ItemModal from './ItemModal'

function heatColor(heat: number): string {
  if (heat === 0) return 'bg-[#3B3F51]'       // cold gray
  if (heat < 0.25) return 'bg-[#4A6FA5]'      // cool blue
  if (heat < 0.5) return 'bg-[#D4A843]'       // warm amber
  if (heat < 0.75) return 'bg-[#E8943A]'      // hot orange
  return 'bg-correct'                           // mastered green
}

export default function Sidebar({ items }: { items: Item[] }) {
  const [selected, setSelected] = useState<Item | null>(null)

  return (
    <>
      <div className="bg-card rounded-2xl border border-border overflow-hidden flex flex-col h-full">
        <div className="px-4 py-3 border-b border-border shrink-0">
          <h3 className="text-sm font-semibold">Library ({items.length})</h3>
          <div className="flex gap-3 mt-1 text-xs text-text-dim">
            <span>{items.filter(i => getHeat(i) >= 0.75).length} hot</span>
            <span>{items.filter(i => getHeat(i) > 0 && getHeat(i) < 0.75).length} warm</span>
            <span>{items.filter(i => getHeat(i) === 0).length} new</span>
          </div>
        </div>
        <div className="overflow-y-auto flex-1">
          {items.map(item => {
            const heat = getHeat(item)
            return (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                className="w-full text-left px-4 py-2.5 hover:bg-card-hover transition-colors border-b border-border/50"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${heatColor(heat)}`} />
                  <span className="text-sm truncate">{item.phrase}</span>
                </div>
                <p className="text-xs text-text-dim italic ml-4 mt-0.5 truncate opacity-60">
                  {item.examples[0]}
                </p>
              </button>
            )
          })}
        </div>
      </div>
      {selected && <ItemModal item={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
