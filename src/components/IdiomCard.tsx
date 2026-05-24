import type { Idiom } from '../types'

export default function IdiomCard({ idiom }: { idiom: Idiom }) {
  const cambridgeUrl = `https://dictionary.cambridge.org/dictionary/english/${idiom.phrase.replace(/\s+/g, '-').replace(/'/g, '')}`

  return (
    <div className="bg-card rounded-2xl p-5 border border-border space-y-4 animate-[fadeIn_0.3s_ease-out]">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-bold text-accent">"{idiom.phrase}"</h3>
        <a href={cambridgeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-text-dim hover:text-accent shrink-0">
          Cambridge →
        </a>
      </div>

      <div>
        <p className="text-xs text-text-dim mb-1 uppercase tracking-wider">Meaning</p>
        <p className="text-sm text-text leading-relaxed">{idiom.meaning}</p>
      </div>

      {idiom.notes && (
        <div>
          <p className="text-xs text-text-dim mb-1 uppercase tracking-wider">Usage Notes</p>
          <p className="text-sm text-text-dim leading-relaxed">{idiom.notes}</p>
        </div>
      )}

      <div>
        <p className="text-xs text-text-dim mb-2 uppercase tracking-wider">Examples</p>
        <div className="space-y-2">
          {idiom.examples.map((ex, i) => (
            <p key={i} className="text-sm text-text leading-relaxed pl-3 border-l-2 border-border">
              {ex}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
