import { useState } from 'react'
import type { MCQuestion, Item } from '../types'

export default function QuizCard({ question, item, num, total, onDone }: {
  question: MCQuestion
  item: Item
  num: number
  total: number
  onDone: (correct: boolean, easy?: boolean) => void
}) {
  const [picked, setPicked] = useState<number | null>(null)
  const answered = picked !== null
  const correct = picked === question.correctIndex

  const url = `https://dictionary.cambridge.org/dictionary/english/${item.phrase.replace(/\s+/g, '-').replace(/'/g, '')}`

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-xs text-accent font-semibold tracking-wider">
          {question.type === 'fill-blank' ? 'FILL IN THE BLANK' : 'WHAT DOES IT MEAN?'}
        </span>
        <span className="text-xs text-text-dim">{num}/{total}</span>
      </div>

      <p className="text-base leading-relaxed">{question.prompt}</p>

      <div className="grid gap-2">
        {question.options.map((opt, i) => {
          let cls = 'bg-card-hover border-border active:scale-[0.98]'
          if (answered) {
            if (i === question.correctIndex) cls = 'bg-correct/15 border-correct'
            else if (i === picked) cls = 'bg-wrong/15 border-wrong'
            else cls = 'bg-card-hover border-border opacity-30'
          }
          return (
            <button key={i} disabled={answered} onClick={() => setPicked(i)}
              className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all ${cls}`}>
              <span className="text-text-dim mr-2 font-semibold">{String.fromCharCode(65 + i)})</span>{opt}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
          <p className={`text-sm font-semibold ${correct ? 'text-correct' : 'text-wrong'}`}>
            {correct ? '✓ Correct!' : `✗ Answer: ${question.options[question.correctIndex]}`}
          </p>

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

          {correct ? (
            <div className="flex gap-3">
              <button onClick={() => onDone(true, false)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold bg-accent/15 border border-accent/30 text-accent hover:bg-accent/25 transition-colors">
                Got it →
              </button>
              <button onClick={() => onDone(true, true)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold bg-correct/10 border border-correct/30 text-correct hover:bg-correct/20 transition-colors">
                Too easy →
              </button>
            </div>
          ) : (
            <button onClick={() => onDone(false)}
              className="w-full py-3 rounded-xl text-sm font-semibold bg-wrong/10 border border-wrong/30 text-wrong hover:bg-wrong/20 transition-colors">
              Next →
            </button>
          )}
        </div>
      )}
    </div>
  )
}
