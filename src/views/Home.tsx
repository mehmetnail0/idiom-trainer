import { useStore } from '../store/store'
import { getHeat, isDue } from '../lib/fsrs'

export default function Home({ onStart }: { onStart: () => void }) {
  const { items, streak, stats, todayStats } = useStore()
  const today = todayStats()

  const hot = items.filter(i => getHeat(i) >= 0.75).length
  const warm = items.filter(i => getHeat(i) > 0 && getHeat(i) < 0.75).length
  const fresh = items.filter(i => getHeat(i) === 0).length
  const dueNow = items.filter(i => isDue(i)).length

  const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString().slice(0, 10)
  const weekReviewed = stats.filter(s => s.date >= weekAgo).reduce((a, s) => a + s.reviewed, 0)
  const monthAgo = new Date(Date.now() - 30 * 86_400_000).toISOString().slice(0, 10)
  const monthReviewed = stats.filter(s => s.date >= monthAgo).reduce((a, s) => a + s.reviewed, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Idiom Trainer</h1>
        <p className="text-[11px] text-text-dim/50 mt-1">FSRS · {items.length} items · {dueNow} due</p>
      </div>

      <button onClick={onStart} className="w-full bg-accent/90 hover:bg-accent text-bg font-semibold py-3.5 rounded-lg text-sm transition-colors">
        {dueNow > 0 ? `Review ${dueNow} due` : 'Start'}
      </button>

      {/* Heat */}
      <div>
        <div className="flex justify-between text-[10px] text-text-dim/40 mb-1.5 uppercase tracking-wider">
          <span>{hot} learned</span><span>{warm} warming</span><span>{fresh} new</span>
        </div>
        <div className="h-1.5 bg-border/40 rounded-full overflow-hidden flex">
          {hot > 0 && <div className="bg-correct/60 transition-all duration-700" style={{ width: `${(hot / items.length) * 100}%` }} />}
          {warm > 0 && <div className="bg-accent/50 transition-all duration-700" style={{ width: `${(warm / items.length) * 100}%` }} />}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { n: streak, l: 'streak' },
          { n: today.reviewed, l: 'today' },
          { n: weekReviewed, l: 'week' },
          { n: monthReviewed, l: 'month' },
        ].map(s => (
          <div key={s.l} className="rounded-lg p-2.5 text-center border border-border/30">
            <div className="text-lg font-semibold text-text/70">{s.n}</div>
            <div className="text-[9px] text-text-dim/40 uppercase tracking-wider">{s.l}</div>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-text-dim/30">
        {items.filter(i => i.type === 'idiom').length} idioms · {items.filter(i => i.type === 'word').length} words · max 5 new/day
      </p>
    </div>
  )
}
