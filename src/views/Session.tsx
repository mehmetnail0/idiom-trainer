import { useState, useMemo, useCallback, useEffect } from 'react'
import { useStore } from '../store/store'
import { buildQueue, generateQuestion } from '../lib/questions'
import { Question } from '../types'
import MCQuestion from '../components/MCQuestion'
import ProdQuestion from '../components/ProdQuestion'

export default function Session({ onExit }: { onExit: () => void }) {
  const { idioms, recordAnswer, finishSession } = useStore()

  const questions = useMemo(() => {
    const queue = buildQueue(idioms, 10)
    return queue.map(i => ({ question: generateQuestion(i, idioms), idiomId: i.id }))
  }, [])

  const [index, setIndex] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [done, setDone] = useState(false)
  const [startTime] = useState(Date.now)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (done) return
    const t = setInterval(() => setElapsed(Date.now() - startTime), 1000)
    return () => clearInterval(t)
  }, [done, startTime])

  const handleAnswer = useCallback((correct: boolean) => {
    recordAnswer(questions[index].idiomId, correct)
    if (correct) setCorrectCount(c => c + 1)
    else setWrongCount(c => c + 1)
    setAnswered(true)
  }, [index, questions, recordAnswer])

  const handleNext = () => {
    if (index < questions.length - 1) {
      setIndex(i => i + 1)
      setAnswered(false)
    } else {
      finishSession()
      setDone(true)
    }
  }

  const mins = Math.floor(elapsed / 60000)
  const secs = Math.floor((elapsed % 60000) / 1000)
  const total = questions.length
  const q = questions[index]?.question

  if (done) {
    const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-card rounded-2xl p-6 w-full max-w-sm border border-border space-y-4">
          <h2 className="text-xl font-bold text-accent">Session Complete</h2>
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-text-dim">Questions</span><span className="font-semibold">{total}</span></div>
            <div className="flex justify-between"><span className="text-text-dim">Correct</span><span className="font-semibold text-correct">{correctCount}</span></div>
            <div className="flex justify-between"><span className="text-text-dim">Wrong</span><span className="font-semibold text-wrong">{wrongCount}</span></div>
            <div className="flex justify-between"><span className="text-text-dim">Score</span><span className="font-semibold text-accent">{pct}%</span></div>
            <div className="flex justify-between"><span className="text-text-dim">Time</span><span className="font-semibold">{mins}:{String(secs).padStart(2, '0')}</span></div>
          </div>
          <button onClick={onExit} className="w-full bg-accent text-bg font-semibold py-3 rounded-xl">Done</button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="font-mono text-xl font-bold tabular-nums text-accent">
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </div>
        <button onClick={() => { finishSession(); setDone(true) }} className="text-text-dim text-sm">End early</button>
      </div>

      <div className="bg-card rounded-2xl p-5 border border-border">
        {q && q.type === 'production' ? (
          <ProdQuestion question={q} num={index + 1} total={total} onAnswer={handleAnswer} />
        ) : q ? (
          <MCQuestion question={q} num={index + 1} total={total} onAnswer={handleAnswer} />
        ) : null}
      </div>

      {answered && (
        <button onClick={handleNext} className="w-full bg-accent/20 text-accent font-semibold py-3 rounded-xl">
          {index < questions.length - 1 ? 'Next' : 'Finish'}
        </button>
      )}
    </div>
  )
}
