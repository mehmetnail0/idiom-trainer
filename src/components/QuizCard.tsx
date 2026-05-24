import { useState } from 'react'
import type { MCQuestion, Item } from '../types'

export default function QuizCard({ question, item, num, total, onDone }: {
  question: MCQuestion; item: Item; num: number; total: number
  onDone: (correct: boolean, easy?: boolean) => void
}) {
  const [picked, setPicked] = useState<number | null>(null)
  const answered = picked !== null
  const correct = picked === question.correctIndex

  const typeLabel = {
    'fill-blank': 'FILL IN THE BLANK',
    'meaning-match': 'MEANING',
    'sentence-judge': 'RIGHT OR WRONG?',
  }

  const url = `https://dictionary.cambridge.org/dictionary/english/${item.phrase.replace(/\s+/g, '-').replace(/'/g, '')}`

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-text-dim uppercase tracking-[0.15em]">{typeLabel[question.type]}</span>
        <span className="text-[10px] text-text-dim">{num}/{total}</span>
      </div>

      <p className="text-[15px] leading-relaxed text-text">{question.prompt}</p>

      <div className="grid gap-2">
        {question.options.map((opt, i) => {
          let cls = 'border-border/60 hover:border-border'
          if (answered) {
            if (i === question.correctIndex) cls = 'border-correct/40 bg-correct/5'
            else if (i === picked) cls = 'border-wrong/40 bg-wrong/5'
            else cls = 'border-border/20 opacity-25'
          }
          const parts = opt.split('\n» ')
          return (
            <button key={i} disabled={answered} onClick={() => setPicked(i)}
              className={`w-full text-left px-4 py-3 rounded-lg border text-[13px] leading-relaxed transition-all ${cls}`}>
              {question.type === 'sentence-judge' ? (
                opt
              ) : (
                <div>
                  <span className="text-text-dim mr-2">{String.fromCharCode(65 + i)})</span>
                  {parts[0]}
                  {parts[1] && <p className="text-[11px] text-text-dim/50 italic mt-1 ml-5">» {parts[1]}</p>}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className="space-y-4 animate-[fadeIn_0.25s_ease-out]">
          <p className={`text-xs font-medium ${correct ? 'text-correct' : 'text-wrong'}`}>
            {correct ? '✓ Correct' : `✗ ${question.options[question.correctIndex]}`}
          </p>

          <div className="rounded-lg p-4 space-y-2.5 border border-border/30 bg-bg/50">
            <div className="flex justify-between items-baseline">
              <p className="text-accent text-sm font-medium">{item.phrase}</p>
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-text-dim hover:text-accent transition-colors">
                cambridge →
              </a>
            </div>
            <p className="text-xs text-text/80">{item.meaning}</p>
            {item.notes && <p className="text-[11px] text-text-dim leading-relaxed">{item.notes}</p>}
            <div className="space-y-1 pt-1">
              {item.examples.map((ex, i) => (
                <p key={i} className="text-[11px] text-text-dim/70 italic pl-2.5 border-l border-border/30">{ex}</p>
              ))}
            </div>
            {item.wrongExample && (
              <p className="text-[11px] text-wrong/50 pl-2.5 border-l border-wrong/20 italic">
                ✗ {item.wrongExample}
              </p>
            )}
          </div>

          {correct ? (
            <div className="flex gap-2">
              <button onClick={() => onDone(true, false)}
                className="flex-1 py-2.5 rounded-lg text-xs font-medium border border-border/40 text-text-dim hover:text-text hover:border-border transition-colors">
                Got it →
              </button>
              <button onClick={() => onDone(true, true)}
                className="flex-1 py-2.5 rounded-lg text-xs font-medium border border-correct/20 text-correct/70 hover:text-correct hover:border-correct/40 transition-colors">
                Easy →
              </button>
            </div>
          ) : (
            <button onClick={() => onDone(false)}
              className="w-full py-2.5 rounded-lg text-xs font-medium border border-border/40 text-text-dim hover:text-text hover:border-border transition-colors">
              Next →
            </button>
          )}
        </div>
      )}
    </div>
  )
}
