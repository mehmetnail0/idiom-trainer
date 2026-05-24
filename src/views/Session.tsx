import { useState, useMemo } from 'react'
import { useStore } from '../store/store'
import { buildQueue } from '../lib/fsrs'
import { generateQuestion } from '../lib/questions'
import type { MCQuestion } from '../types'
import QuizCard from '../components/QuizCard'

type QItem = { question: MCQuestion; itemId: string; key: number }

function shuffle<T>(a: T[]): T[] {
  const c = [...a]
  for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [c[i], c[j]] = [c[j], c[i]] }
  return c
}

export default function Session({ onExit }: { onExit: () => void }) {
  const { items, rate } = useStore()

  const [queue] = useState<QItem[]>(() => {
    let ids = buildQueue(items)
    if (ids.length === 0) ids = shuffle(items.map(i => i.id)).slice(0, 10)
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
    rate(current.itemId, correct ? (easy ? 4 : 3) : 1)
    if (correct) setCorrectCount(c => c + 1)
    setTotalCount(t => t + 1)
    if (index < queue.length - 1) setIndex(i => i + 1)
    else setDone(true)
  }

  if (done) {
    const pct = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-[fadeIn_0.3s_ease-out]">
        <div className="w-full max-w-xs space-y-5">
          <div className="space-y-1">
            <p className="text-lg font-semibold text-correct/80">Done ✓</p>
            <p className="text-[10px] text-text-dim/40">Progress saved</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-text-dim">Reviewed</span><span>{totalCount}</span></div>
            <div className="flex justify-between text-sm"><span className="text-text-dim">Correct</span><span className="text-correct">{correctCount}</span></div>
            <div className="flex justify-between text-sm"><span className="text-text-dim">Score</span><span className="text-accent">{pct}%</span></div>
          </div>
          <button onClick={onExit} className="w-full py-2.5 rounded-lg text-sm border border-border/40 text-text-dim hover:text-text transition-colors">
            Back
          </button>
        </div>
      </div>
    )
  }

  if (!current || !currentItem) return null

  return (
    <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-text-dim/40 uppercase tracking-[0.15em]">{index + 1} / {queue.length}</span>
        <button onClick={() => setDone(true)} className="text-[10px] text-text-dim/40 hover:text-text-dim uppercase tracking-wider transition-colors">end</button>
      </div>

      <div className="bg-card rounded-xl p-5 border border-border/40 animate-[slideUp_0.25s_ease-out]">
        <QuizCard key={current.key} question={current.question} item={currentItem} num={index + 1} total={queue.length} onDone={handleDone} />
      </div>
    </div>
  )
}
