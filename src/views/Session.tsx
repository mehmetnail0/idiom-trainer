import { useState, useMemo, useCallback } from 'react'
import { useStore } from '../store/store'
import { buildQueue, generateQuestion } from '../lib/questions'
import type { Question } from '../types'
import QuestionView from '../components/QuestionView'

type QItem = { question: Question; idiomId: string; key: number }

export default function Session({ onExit }: { onExit: () => void }) {
  const { idioms, recordAnswer, finishSession } = useStore()

  const [queue, setQueue] = useState<QItem[]>(() => {
    const ids = buildQueue(idioms, 10)
    return ids.map((id, i) => ({ question: generateQuestion(idioms.find(x => x.id === id)!, idioms), idiomId: id, key: i }))
  })

  const [index, setIndex] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [wrongIds, setWrongIds] = useState<string[]>([])
  const [done, setDone] = useState(false)

  const total = queue.length
  const current = queue[index]
  const currentIdiom = useMemo(() => idioms.find(i => i.id === current?.idiomId), [idioms, current?.idiomId])

  const handleAnswer = useCallback((correct: boolean) => {
    if (!current) return
    recordAnswer(current.idiomId, correct)
    if (correct) setCorrectCount(c => c + 1)
    else {
      setWrongCount(c => c + 1)
      setWrongIds(ids => ids.includes(current.idiomId) ? ids : [...ids, current.idiomId])
    }
    setAnswered(true)
  }, [current, recordAnswer])

  const handleNext = useCallback(() => {
    setAnswered(false)
    if (index < queue.length - 1) {
      setIndex(i => i + 1)
    } else if (wrongIds.length > 0) {
      const retryItems: QItem[] = wrongIds.map((id, i) => ({
        question: generateQuestion(idioms.find(x => x.id === id)!, idioms),
        idiomId: id,
        key: queue.length + i,
      }))
      setQueue(q => [...q, ...retryItems])
      setWrongIds([])
      setIndex(i => i + 1)
    } else {
      finishSession()
      setDone(true)
    }
  }, [index, queue.length, wrongIds, idioms, finishSession])

  if (done) {
    const pct = total > 0 ? Math.round((correctCount / (correctCount + wrongCount)) * 100) : 0
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-card rounded-2xl p-6 w-full max-w-sm border border-border space-y-4">
          <h2 className="text-xl font-bold text-accent">Session Complete</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-text-dim">Questions</span><span className="font-semibold">{correctCount + wrongCount}</span></div>
            <div className="flex justify-between"><span className="text-text-dim">Correct</span><span className="font-semibold text-correct">{correctCount}</span></div>
            <div className="flex justify-between"><span className="text-text-dim">Wrong</span><span className="font-semibold text-wrong">{wrongCount}</span></div>
            <div className="flex justify-between"><span className="text-text-dim">Score</span><span className="font-semibold text-accent">{pct}%</span></div>
          </div>
          <button onClick={onExit} className="w-full bg-accent text-bg font-semibold py-3 rounded-xl">Done</button>
        </div>
      </div>
    )
  }

  if (!current || !currentIdiom) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-accent">{index + 1} / {queue.length}</span>
        <button onClick={() => { finishSession(); setDone(true) }} className="text-text-dim text-sm hover:text-text">End early</button>
      </div>

      <div className="bg-card rounded-2xl p-5 border border-border">
        <QuestionView key={current.key} question={current.question} idiom={currentIdiom} num={index + 1} total={queue.length} onAnswer={handleAnswer} />
      </div>

      {answered && (
        <button onClick={handleNext} className="w-full bg-accent/20 text-accent font-semibold py-3 rounded-xl transition-all active:scale-[0.98]">
          {index < queue.length - 1 || wrongIds.length > 0 ? 'Next' : 'Finish'}
        </button>
      )}
    </div>
  )
}
