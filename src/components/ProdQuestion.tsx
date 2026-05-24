import { useState } from 'react'
import { ProdQuestion as PQ } from '../types'

export default function ProdQuestion({ question, num, total, onAnswer }: { question: PQ; num: number; total: number; onAnswer: (correct: boolean) => void }) {
  const [text, setText] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [rated, setRated] = useState(false)

  const handleReveal = () => { if (text.trim().length >= 3) setRevealed(true) }

  const handleRate = (correct: boolean) => {
    setRated(true)
    onAnswer(correct)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-xs text-accent font-semibold tracking-wider">USE IT</span>
        <span className="text-xs text-text-dim">{num}/{total}</span>
      </div>
      <p className="text-lg leading-relaxed">{question.prompt}</p>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        disabled={revealed}
        placeholder="Write your sentence here..."
        className="w-full bg-card-hover border border-border rounded-xl p-3 text-sm text-text resize-none h-24 focus:outline-none focus:border-accent"
      />

      {!revealed && (
        <button onClick={handleReveal} disabled={text.trim().length < 3} className="w-full bg-accent text-bg font-semibold py-3 rounded-xl disabled:opacity-40 transition-opacity">
          Check
        </button>
      )}

      {revealed && !rated && (
        <div className="space-y-3">
          <div className="bg-card-hover rounded-xl p-4 border border-border space-y-2">
            <p className="text-xs text-text-dim">Meaning:</p>
            <p className="text-sm text-text">{question.meaning}</p>
            <p className="text-xs text-text-dim mt-2">Example:</p>
            <p className="text-sm text-text italic">{question.example}</p>
          </div>
          <p className="text-sm text-text-dim text-center">Did you use it correctly?</p>
          <div className="flex gap-3">
            <button onClick={() => handleRate(true)} className="flex-1 bg-correct/15 border border-correct text-correct font-semibold py-3 rounded-xl">
              ✓ Nailed it
            </button>
            <button onClick={() => handleRate(false)} className="flex-1 bg-wrong/15 border border-wrong text-wrong font-semibold py-3 rounded-xl">
              ✗ Not quite
            </button>
          </div>
        </div>
      )}

      {rated && (
        <div className="text-sm text-text-dim">Self-rated. Moving on...</div>
      )}
    </div>
  )
}
