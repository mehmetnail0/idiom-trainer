import { useStore } from '../store/store'

export default function Home({ onStart }: { onStart: () => void }) {
  const { idioms, streak, totalSessions } = useStore()
  const mastered = idioms.filter(i => i.status === 'mastered').length
  const learning = idioms.filter(i => i.status === 'learning').length
  const newCount = idioms.filter(i => i.status === 'new').length

  const weekAgo = Date.now() - 7 * 86_400_000
  const weekIdioms = idioms.filter(i => i.lastSeen && i.lastSeen > weekAgo)
  const weakness = [...idioms].filter(i => i.wrong > 0).sort((a, b) => b.wrong - a.wrong).slice(0, 5)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Idiom Trainer</h1>
        <p className="text-text-dim text-sm mt-1">Master idioms through daily drills</p>
      </div>

      <button onClick={onStart} className="w-full bg-accent text-bg font-bold py-4 rounded-2xl text-lg active:scale-[0.98] transition-transform">
        Start Session
      </button>

      <div className="w-full">
        <div className="flex justify-between text-xs text-text-dim mb-1.5">
          <span>{mastered} mastered</span>
          <span>{learning} learning</span>
          <span>{newCount} new</span>
        </div>
        <div className="h-3 bg-border rounded-full overflow-hidden flex">
          {mastered > 0 && <div className="bg-correct transition-all" style={{ width: `${(mastered / idioms.length) * 100}%` }} />}
          {learning > 0 && <div className="bg-accent transition-all" style={{ width: `${(learning / idioms.length) * 100}%` }} />}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card rounded-xl p-3 text-center border border-border">
          <div className="text-2xl font-bold text-accent">{streak}</div>
          <div className="text-xs text-text-dim">Streak</div>
        </div>
        <div className="bg-card rounded-xl p-3 text-center border border-border">
          <div className="text-2xl font-bold">{totalSessions}</div>
          <div className="text-xs text-text-dim">Sessions</div>
        </div>
        <div className="bg-card rounded-xl p-3 text-center border border-border">
          <div className="text-2xl font-bold">{weekIdioms.length}</div>
          <div className="text-xs text-text-dim">This week</div>
        </div>
      </div>

      {weakness.length > 0 && (
        <div className="bg-card rounded-xl p-4 border border-border">
          <h3 className="text-sm font-semibold text-wrong mb-2">Weakness Report</h3>
          {weakness.map(w => (
            <div key={w.id} className="flex justify-between text-sm py-1">
              <span>{w.phrase}</span>
              <span className="text-text-dim text-xs">{w.wrong}x wrong</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
