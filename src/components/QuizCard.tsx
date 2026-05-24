import { useState } from 'react'
import type { MCQuestion, Item, Rating } from '../types'

export default function QuizCard({ question, item, num, total, onRate }: {
  question: MCQuestion; item: Item; num: number; total: number; onRate: (rating: Rating) => void
}) {
  const [picked, setPicked] = useState<number | null>(null)
  const answered = picked !== null
  const correct = picked === question.correctIndex

  const handlePick = (i: number) => {
    if (answered) return
    setPicked(i)
  }

  const url = `https://dictionary.cambridge.org/dictionary/english/${item.phrase.replace(/\s+/g, '-').replace(/'/g, '')}`

  return (
    <div className="space-y-4">
      {/* Question header */}
      <div className="flex justify-between items-center">
        <span className="text-xs text-accent font-semibold tracking-wider">
          {question.type === 'fill-blank' ? 'FILL IN THE BLANK' : 'WHAT DOES IT MEAN?'}
        </span>
        <span className="text-xs text-text-dim">{num}/{total}</span>
      </div>

      {/* Prompt */}
      <p className="text-base leading-relaxed">{question.prompt}</p>

      {/* Options */}
      <div className="grid gap-2">
        {question.options.map((opt, i) => {
          let cls = 'bg-card-hover border-border'
          if (answered) {
            if (i === question.correctIndex) cls = 'bg-correct/15 border-correct'
            else if (i === picked) cls = 'bg-wrong/15 border-wrong'
            else cls = 'bg-card-hover border-border opacity-30'
          }
          return (
            <button key={i} disabled={answered} onClick={() => handlePick(i)}
              className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all active:scale-[0.98] ${cls}`}>
              <span className="text-text-dim mr-2 font-semibold">{String.fromCharCode(65 + i)})</span>{opt}
            </button>
          )
        })}
      </div>

      {/* Post-answer: idiom info + FSRS rating */}
      {answered && (
        <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
          {/* Result */}
          <p className={`text-sm font-semibold ${correct ? 'text-correct' : 'text-wrong'}`}>
            {correct ? '✓ Correct!' : `✗ Answer: ${question.options[question.correctIndex]}`}
          </p>

          {/* Idiom card */}
          <div className="bg-bg rounded-xl p-4 space-y-3 border border-border/50">
            <div className="flex justify-between items-start">
              <p className="text-accent font-semibold text-sm">"{item.phrase}"</p>
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-text-dim hover:text-accent">Cambridge →</a>
            </div>
            <p className="text-xs text-text">{item.meaning}</p>
            {item.notes && <p className="text-xs text-text-dim italic leading-relaxed">{item.notes}</p>}
            <div className="space-y-1">
              {item.examples.slice(0, 3).map((ex, i) => (
                <p key={i} className="text-xs text-text-dim pl-2 border-l border-border/50 leading-relaxed">{ex}</p>
              ))}
            </div>
          </div>

          {/* FSRS Rating */}
          <div>
            <p className="text-xs text-text-dim text-center mb-2">How well did you know this?</p>
            <div className="grid grid-cols-4 gap-2">
              <button onClick={() => onRate(1)} className="py-2.5 rounded-xl text-xs font-medium bg-wrong/10 border border-wrong/30 text-wrong hover:bg-wrong/20 transition-colors">
                Again
              </button>
              <button onClick={() => onRate(2)} className="py-2.5 rounded-xl text-xs font-medium bg-half/10 border border-half/30 text-half hover:bg-half/20 transition-colors">
                Hard
              </button>
              <button onClick={() => onRate(3)} className="py-2.5 rounded-xl text-xs font-medium bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 transition-colors">
                Good
              </button>
              <button onClick={() => onRate(4)} className="py-2.5 rounded-xl text-xs font-medium bg-correct/10 border border-correct/30 text-correct hover:bg-correct/20 transition-colors">
                Easy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
