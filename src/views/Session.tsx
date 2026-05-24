import { useState, useMemo, useCallback } from 'react'
import { useStore } from '../store/store'
import { buildQueue } from '../lib/fsrs'
import { generateQuestion } from '../lib/questions'
import type { MCQuestion, Rating } from '../types'
import QuizCard from '../components/QuizCard'

type QItem = { question: MCQuestion; itemId: string; key: number }

export default function Session({ onExit }: { onExit: () => void }) {
  const { items, rate } = useStore()

  const [queue, setQueue] = useState<QItem[]>(() => {
    const ids = buildQueue(items, 5, 15)
    return ids.map((id, i) => ({
      question: generateQuestion(items.find(x => x.id === id)!, items),
      itemId: id,
      key: i,
    }))
  })

  const [index, setIndex] = useState(0)
  const [rated, setRated] = useState(false)
  const [sessionCorrect, setSessionCorrect] = useState(0)
  const [sessionTotal, setSessionTotal] = useState(0)
  const [againIds, setAgainIds] = useState<string[]>([])
  const [done, setDone] = useState(false)

  const current = queue[index]
  const currentItem = useMemo(() => items.find(i => i.id === current?.itemId), [items, current?.itemId])

  const handleRate = useCallback((rating: Rating) => {
    if (!current) return
    rate(current.itemId, rating)
    setRated(true)
    setSessionTotal(t => t + 1)
    if (rating >= 2) setSessionCorrect(c => c + 1)
    if (rating === 1) setAgainIds(ids => ids.includes(current.itemId) ? ids : [...ids, current.itemId])
  }, [current, rate])

  const handleNext = useCallback(() => {
    setRated(false)
    if (index < queue.length - 1) {
      setIndex(i => i + 1)
    } else if (againIds.length > 0) {
      const retry: QItem[] = againIds.map((id, i) => ({
        question: generateQuestion(items.find(x => x.id === id)!, items),
        itemId: id,
        key: queue.length + i,
      }))
      setQueue(q => [...q, ...retry])
      setAgainIds([])
      setIndex(i => i + 1)
    } else {
      setDone(true)
    }
  }, [index, queue.length, againIds, items])

  if (done) {
    const pct = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-card rounded-2xl p-6 w-full max-w-sm border border-border space-y-4">
          <h2 className="text-xl font-bold text-accent">Session Complete</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-text-dim">Reviewed</span><span className="font-semibold">{sessionTotal}</span></div>
            <div className="flex justify-between"><span className="text-text-dim">Correct</span><span className="font-semibold text-correct">{sessionCorrect}</span></div>
            <div className="flex justify-between"><span className="text-text-dim">Score</span><span className="font-semibold text-accent">{pct}%</span></div>
          </div>
          <button onClick={onExit} className="w-full bg-accent text-bg font-semibold py-3 rounded-xl">Done</button>
        </div>
      </div>
    )
  }

  if (!current || !currentItem) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-accent">{index + 1} / {queue.length}{againIds.length > 0 ? ` (+${againIds.length})` : ''}</span>
        <button onClick={() => setDone(true)} className="text-text-dim text-sm hover:text-text">End</button>
      </div>

      <div className="bg-card rounded-2xl p-5 border border-border">
        <QuizCard key={current.key} question={current.question} item={currentItem} num={index + 1} total={queue.length} onRate={handleRate} />
      </div>

      {rated && (
        <button onClick={handleNext} className="w-full bg-accent/20 text-accent font-semibold py-3 rounded-xl active:scale-[0.98] transition-all">
          {index < queue.length - 1 || againIds.length > 0 ? 'Next' : 'Finish'}
        </button>
      )}
    </div>
  )
}
