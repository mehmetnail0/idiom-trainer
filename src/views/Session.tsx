import { useState, useMemo } from 'react'
import { useStore } from '../store/store'
import { buildQueue } from '../lib/fsrs'
import { generateQuestion } from '../lib/questions'
import type { MCQuestion } from '../types'
import QuizCard from '../components/QuizCard'

type QItem = { question: MCQuestion; itemId: string; key: number }

export default function Session({ onExit }: { onExit: () => void }) {
  const { items, rate } = useStore()

  const [queue] = useState<QItem[]>(() => {
    const ids = buildQueue(items, 5, 15)
    return ids.map((id, i) => ({
      question: generateQuestion(items.find(x => x.id === id)!, items),
      itemId: id,
      key: i,
    }))
  })

  const [index, setIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [done, setDone] = useState(false)

  const current = queue[index]
  const currentItem = useMemo(() => items.find(i => i.id === current?.itemId), [items, current?.itemId])

  const handleDone = (correct: boolean, easy?: boolean) => {
    if (!current) return

    if (correct) {
      rate(current.itemId, easy ? 4 : 3)
      setCorrectCount(c => c + 1)
    } else {
      rate(current.itemId, 1)
    }
    setTotalCount(t => t + 1)

    if (index < queue.length - 1) {
      setIndex(i => i + 1)
    } else {
      setDone(true)
    }
  }

  if (queue.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-card rounded-2xl p-6 w-full max-w-sm border border-border text-center space-y-4">
          <p className="text-text-dim">Nothing due right now. Come back later or add new items.</p>
          <button onClick={onExit} className="w-full bg-accent text-bg font-semibold py-3 rounded-xl">Back</button>
        </div>
      </div>
    )
  }

  if (done) {
    const pct = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-card rounded-2xl p-6 w-full max-w-sm border border-border space-y-4">
          <h2 className="text-xl font-bold text-accent">Done</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-text-dim">Reviewed</span><span className="font-semibold">{totalCount}</span></div>
            <div className="flex justify-between"><span className="text-text-dim">Correct</span><span className="font-semibold text-correct">{correctCount}</span></div>
            <div className="flex justify-between"><span className="text-text-dim">Score</span><span className="font-semibold text-accent">{pct}%</span></div>
          </div>
          <button onClick={onExit} className="w-full bg-accent text-bg font-semibold py-3 rounded-xl">Back</button>
        </div>
      </div>
    )
  }

  if (!current || !currentItem) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-accent">{index + 1} / {queue.length}</span>
        <button onClick={() => setDone(true)} className="text-text-dim text-sm hover:text-text">End</button>
      </div>

      <div className="bg-card rounded-2xl p-5 border border-border">
        <QuizCard key={current.key} question={current.question} item={currentItem} num={index + 1} total={queue.length} onDone={handleDone} />
      </div>
    </div>
  )
}
