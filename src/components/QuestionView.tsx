import { useState } from 'react'
import type { Question, Idiom } from '../types'
import IdiomCard from './IdiomCard'

export default function QuestionView({ question, idiom, num, total, onAnswer }: { question: Question; idiom: Idiom; num: number; total: number; onAnswer: (correct: boolean) => void }) {
  const [picked, setPicked] = useState<number | null>(null)
  const [prodText, setProdText] = useState('')
  const [prodRevealed, setProdRevealed] = useState(false)
  const [done, setDone] = useState(false)

  const typeLabel = { 'fill-blank': 'FILL IN THE BLANK', 'meaning-match': 'MEANING MATCH', 'context-usage': 'CONTEXT USAGE', production: 'USE IT' }

  const handleMCPick = (i: number) => {
    if (picked !== null) return
    setPicked(i)
    if (question.type !== 'production') {
      const correct = i === question.correctIndex
      setDone(true)
      onAnswer(correct)
    }
  }

  const handleProdReveal = () => { if (prodText.trim().length >= 3) setProdRevealed(true) }

  const handleProdRate = (correct: boolean) => { setDone(true); onAnswer(correct) }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-xs text-accent font-semibold tracking-wider">{typeLabel[question.type]}</span>
        <span className="text-xs text-text-dim">{num}/{total}</span>
      </div>

      {question.type !== 'production' && (
        <>
          <p className="text-base leading-relaxed">{question.prompt}</p>
          <div className="grid gap-2">
            {question.options.map((opt, i) => {
              let cls = 'bg-card-hover border-border'
              if (picked !== null) {
                if (i === question.correctIndex) cls = 'bg-correct/15 border-correct'
                else if (i === picked) cls = 'bg-wrong/15 border-wrong'
                else cls = 'bg-card-hover border-border opacity-40'
              }
              return (
                <button key={i} disabled={picked !== null} onClick={() => handleMCPick(i)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all ${cls}`}>
                  <span className="text-text-dim mr-2 font-semibold">{String.fromCharCode(65 + i)})</span>{opt}
                </button>
              )
            })}
          </div>
          {picked !== null && (
            <p className={`text-sm font-medium ${picked === question.correctIndex ? 'text-correct' : 'text-wrong'}`}>
              {picked === question.correctIndex ? '✓ Correct!' : `✗ Wrong — answer was ${String.fromCharCode(65 + question.correctIndex)}`}
            </p>
          )}
        </>
      )}

      {question.type === 'production' && (
        <>
          <p className="text-base leading-relaxed">{question.prompt}</p>
          <textarea value={prodText} onChange={e => setProdText(e.target.value)} disabled={prodRevealed}
            placeholder="Write your sentence..." className="w-full bg-card-hover border border-border rounded-xl p-3 text-sm text-text resize-none h-20 focus:outline-none focus:border-accent" />
          {!prodRevealed && (
            <button onClick={handleProdReveal} disabled={prodText.trim().length < 3} className="w-full bg-accent text-bg font-semibold py-3 rounded-xl disabled:opacity-40">Check</button>
          )}
          {prodRevealed && !done && (
            <div className="space-y-3">
              <p className="text-sm text-text-dim text-center">Did you use it correctly?</p>
              <div className="flex gap-3">
                <button onClick={() => handleProdRate(true)} className="flex-1 bg-correct/15 border border-correct text-correct font-semibold py-3 rounded-xl">✓ Nailed it</button>
                <button onClick={() => handleProdRate(false)} className="flex-1 bg-wrong/15 border border-wrong text-wrong font-semibold py-3 rounded-xl">✗ Not quite</button>
              </div>
            </div>
          )}
        </>
      )}

      {done && <IdiomCard idiom={idiom} />}
    </div>
  )
}
