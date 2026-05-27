import { useState, useMemo } from 'react'
import { useStore } from '../store/store'
import { buildQueue } from '../lib/fsrs'
import { generateQuestion } from '../lib/questions'
import type { MCQuestion, Item } from '../types'
import QuizCard from '../components/QuizCard'

type QItem = { question: MCQuestion; itemId: string; key: number }

function shuffle<T>(a: T[]): T[] {
  const c = [...a]
  for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [c[i], c[j]] = [c[j], c[i]] }
  return c
}

function SessionSummary({ correct, wrong, items, onExit, onAgain }: { correct: string[]; wrong: string[]; items: Item[]; onExit: () => void; onAgain: () => void }) {
  const total = correct.length + wrong.length
  const pct = total > 0 ? Math.round((correct.length / total) * 100) : 0

  const wrongItems = wrong.map(id => items.find(i => i.id === id)).filter(Boolean) as Item[]
  const correctItems = correct.map(id => items.find(i => i.id === id)).filter(Boolean) as Item[]

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      <div>
        <p className="text-lg font-semibold text-correct/80">Done ✓</p>
        <p className="text-[10px] text-text-dim/40 mt-1">Progress saved to cloud</p>
      </div>

      <div className="flex gap-4 text-sm">
        <span><span className="text-correct font-semibold">{correct.length}</span> <span className="text-text-dim/40">correct</span></span>
        <span><span className="text-wrong font-semibold">{wrong.length}</span> <span className="text-text-dim/40">wrong</span></span>
        <span><span className="text-accent font-semibold">{pct}%</span></span>
      </div>

      {wrongItems.length > 0 && (
        <div className="rounded-lg p-4 border border-wrong/15 bg-wrong/5 space-y-3">
          <p className="text-[10px] text-wrong/60 uppercase tracking-wider">Review these</p>
          {wrongItems.map(item => (
            <div key={item.id} className="space-y-1">
              <p className="text-sm text-text/80 font-medium">{item.phrase}</p>
              <p className="text-[11px] text-text-dim/50">{item.meaning}</p>
              <p className="text-[11px] text-text-dim/35 italic pl-2 border-l border-border/20">{item.examples[Math.floor(Math.random() * item.examples.length)]}</p>
            </div>
          ))}
        </div>
      )}

      {correctItems.length > 0 && (
        <div className="rounded-lg p-4 border border-border/15 space-y-2">
          <p className="text-[10px] text-correct/40 uppercase tracking-wider">Nailed it</p>
          <div className="flex flex-wrap gap-2">
            {correctItems.map(item => (
              <span key={item.id} className="text-[11px] text-text-dim/50 bg-card-hover px-2 py-1 rounded">{item.phrase}</span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={onExit} className="flex-1 py-3 rounded-lg text-sm border border-border/30 text-text-dim/50 hover:text-text/70 transition-colors">
          Back
        </button>
        <button onClick={onAgain} className="flex-1 py-3 rounded-lg text-sm border border-accent/30 text-accent/70 hover:text-accent hover:border-accent/50 transition-colors">
          Another 10 →
        </button>
      </div>
    </div>
  )
}

export default function Session({ onExit }: { onExit: () => void }) {
  const { items, rate } = useStore()
  const [round, setRound] = useState(0)

  const makeQueue = (): QItem[] => {
    const activeItems = items.filter(i => !i.archived)
    let ids = buildQueue(items)
    if (ids.length === 0) ids = shuffle(activeItems.map(i => i.id))
    ids = ids.slice(0, 10)
    return ids.map((id, i) => ({
      question: generateQuestion(items.find(x => x.id === id)!, items),
      itemId: id,
      key: round * 100 + i,
    }))
  }

  const [queue, setQueue] = useState<QItem[]>(makeQueue)
  const [index, setIndex] = useState(0)
  const [correctIds, setCorrectIds] = useState<string[]>([])
  const [wrongIds, setWrongIds] = useState<string[]>([])
  const [done, setDone] = useState(false)

  const startNewRound = () => {
    setRound(r => r + 1)
    setQueue(makeQueue())
    setIndex(0)
    setCorrectIds([])
    setWrongIds([])
    setDone(false)
  }

  const current = queue[index]
  const currentItem = useMemo(() => items.find(i => i.id === current?.itemId), [items, current?.itemId])

  const handleDone = (correct: boolean, easy?: boolean) => {
    if (!current) return
    rate(current.itemId, correct ? (easy ? 4 : 3) : 1)
    if (correct) setCorrectIds(c => [...c, current.itemId])
    else setWrongIds(w => [...w, current.itemId])
    if (index < queue.length - 1) setIndex(i => i + 1)
    else setDone(true)
  }

  if (done) {
    return <SessionSummary correct={correctIds} wrong={wrongIds} items={items} onExit={onExit} onAgain={startNewRound} />
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
