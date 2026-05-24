import type { Idiom } from '../types'

const statusDot = { new: 'bg-text-dim', learning: 'bg-accent', mastered: 'bg-correct' }

export default function IdiomSidebar({ idioms, activeId, onSelect }: { idioms: Idiom[]; activeId?: string; onSelect: (id: string) => void }) {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold">All Idioms ({idioms.length})</h3>
        <div className="flex gap-3 mt-1 text-xs text-text-dim">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-correct" />{idioms.filter(i => i.status === 'mastered').length}</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent" />{idioms.filter(i => i.status === 'learning').length}</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-text-dim" />{idioms.filter(i => i.status === 'new').length}</span>
        </div>
      </div>
      <div className="overflow-y-auto flex-1 divide-y divide-border">
        {idioms.map(i => (
          <button
            key={i.id}
            onClick={() => onSelect(i.id)}
            className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-card-hover transition-colors ${activeId === i.id ? 'bg-card-hover' : ''}`}
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${statusDot[i.status]}`} />
            <span className="truncate">{i.phrase}</span>
            {i.wrong > 0 && <span className="text-xs text-wrong ml-auto shrink-0">{i.wrong}x</span>}
          </button>
        ))}
      </div>
    </div>
  )
}
