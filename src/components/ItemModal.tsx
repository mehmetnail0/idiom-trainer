import type { Item } from '../types'
import { getHeat, daysUntilDue } from '../lib/fsrs'

export default function ItemModal({ item, onClose }: { item: Item; onClose: () => void }) {
  const heat = getHeat(item)
  const due = daysUntilDue(item)
  const url = `https://dictionary.cambridge.org/dictionary/english/${item.phrase.replace(/\s+/g, '-').replace(/'/g, '')}`

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-card rounded-xl p-5 max-w-md w-full border border-border/50 space-y-4 max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-accent font-medium">{item.phrase}</p>
            <p className="text-[10px] text-text-dim/40 uppercase mt-0.5">{item.type}</p>
          </div>
          <button onClick={onClose} className="text-text-dim/40 hover:text-text-dim text-lg">×</button>
        </div>

        <p className="text-sm text-text/90">{item.meaning}</p>

        {item.notes && (
          <p className="text-[11px] text-text-dim leading-relaxed">{item.notes}</p>
        )}

        <div className="space-y-1.5">
          <p className="text-[9px] text-text-dim/40 uppercase tracking-wider">Examples</p>
          {item.examples.map((ex, i) => (
            <p key={i} className="text-[11px] text-text-dim/60 italic pl-2.5 border-l border-border/30 leading-relaxed">{ex}</p>
          ))}
        </div>

        {item.wrongExample && (
          <div>
            <p className="text-[9px] text-text-dim/40 uppercase tracking-wider mb-1">Wrong usage</p>
            <p className="text-[11px] text-wrong/40 italic pl-2.5 border-l border-wrong/20">✗ {item.wrongExample}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border/30 text-[10px] text-text-dim/40">
          <div className="flex gap-3">
            <span>{item.reps} reps</span>
            <span>{Math.round(heat * 100)}% heat</span>
            {due !== null && <span>{due === 0 ? 'due now' : `${due}d`}</span>}
          </div>
          <a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">cambridge →</a>
        </div>
      </div>
    </div>
  )
}
