import { useStore } from '../store/store'
import { getHeat } from '../lib/fsrs'

export default function Home({ onStart }: { onStart: () => void }) {
  const { items, streak, stats, todayStats } = useStore()
  const today = todayStats()

  const hot = items.filter(i => getHeat(i) >= 0.75).length
  const warm = items.filter(i => getHeat(i) > 0 && getHeat(i) < 0.75).length
  const cold = items.filter(i => getHeat(i) === 0).length

  const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString().slice(0, 10)
  const weekStats = stats.filter(s => s.date >= weekAgo)
  const weekReviewed = weekStats.reduce((a, s) => a + s.reviewed, 0)
  const monthAgo = new Date(Date.now() - 30 * 86_400_000).toISOString().slice(0, 10)
  const monthStats = stats.filter(s => s.date >= monthAgo)
  const monthReviewed = monthStats.reduce((a, s) => a + s.reviewed, 0)

  const dueNow = items.filter(i => !i.nextDue || Date.now() >= i.nextDue).length

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Idiom Trainer</h1>
        <p className="text-text-dim text-sm mt-1">FSRS spaced repetition</p>
      </div>

      <button onClick={onStart} className="w-full bg-accent text-bg font-bold py-4 rounded-2xl text-lg active:scale-[0.98] transition-transform">
        {dueNow > 0 ? `Review (${dueNow} due)` : 'Start Session'}
      </button>

      {/* Heat bar */}
      <div className="w-full">
        <div className="flex justify-between text-xs text-text-dim mb-1.5">
          <span>{hot} hot</span><span>{warm} warming</span><span>{cold} new</span>
        </div>
        <div className="h-3 bg-border rounded-full overflow-hidden flex">
          {hot > 0 && <div className="bg-correct transition-all duration-500" style={{ width: `${(hot / items.length) * 100}%` }} />}
          {warm > 0 && <div className="bg-accent transition-all duration-500" style={{ width: `${(warm / items.length) * 100}%` }} />}
        </div>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-card rounded-xl p-3 text-center border border-border">
          <div className="text-xl font-bold text-accent">{streak}</div>
          <div className="text-xs text-text-dim">Streak</div>
        </div>
        <div className="bg-card rounded-xl p-3 text-center border border-border">
          <div className="text-xl font-bold">{today.reviewed}</div>
          <div className="text-xs text-text-dim">Today</div>
        </div>
        <div className="bg-card rounded-xl p-3 text-center border border-border">
          <div className="text-xl font-bold">{weekReviewed}</div>
          <div className="text-xs text-text-dim">Week</div>
        </div>
        <div className="bg-card rounded-xl p-3 text-center border border-border">
          <div className="text-xl font-bold">{monthReviewed}</div>
          <div className="text-xs text-text-dim">Month</div>
        </div>
      </div>

      {/* Total */}
      <div className="bg-card rounded-xl p-4 border border-border text-sm text-text-dim">
        {items.length} items in library · {items.filter(i => i.type === 'idiom').length} idioms · {items.filter(i => i.type === 'word').length} words
      </div>
    </div>
  )
}
