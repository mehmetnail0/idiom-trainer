import type { Item } from '../types'
import { getHeat, daysUntilDue } from '../lib/fsrs'

export default function ItemModal({ item, onClose }: { item: Item; onClose: () => void }) {
  const heat = getHeat(item)
  const due = daysUntilDue(item)
  const url = `https://dictionary.cambridge.org/dictionary/english/${item.phrase.replace(/\s+/g, '-').replace(/'/g, '')}`

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-card rounded-2xl p-5 max-w-md w-full border border-border space-y-4 max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-accent">"{item.phrase}"</h3>
            <span className="text-xs text-text-dim">{item.type === 'word' ? 'Word' : 'Idiom'}</span>
          </div>
          <button onClick={onClose} className="text-text-dim hover:text-text text-lg leading-none">×</button>
        </div>

        <p className="text-sm text-text">{item.meaning}</p>

        {item.notes && (
          <div>
            <p className="text-xs text-text-dim mb-1 uppercase tracking-wider">Usage</p>
            <p className="text-xs text-text-dim leading-relaxed">{item.notes}</p>
          </div>
        )}

        <div>
          <p className="text-xs text-text-dim mb-2 uppercase tracking-wider">Examples</p>
          <div className="space-y-1.5">
            {item.examples.map((ex, i) => (
              <p key={i} className="text-xs text-text leading-relaxed pl-3 border-l-2 border-border">{ex}</p>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-text-dim pt-2 border-t border-border">
          <div className="flex gap-3">
            <span>✓ {item.reps} reps</span>
            <span>Heat: {Math.round(heat * 100)}%</span>
            {due !== null && <span>Due: {due === 0 ? 'now' : `${due}d`}</span>}
          </div>
          <a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-accent">Cambridge →</a>
        </div>
      </div>
    </div>
  )
}
