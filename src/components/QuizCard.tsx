import { useState, useMemo } from 'react'
import type { MCQuestion, Item } from '../types'

function shuffleExamples(examples: string[]): string[] {
  const c = [...examples]
  for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [c[i], c[j]] = [c[j], c[i]] }
  return c
}

export default function QuizCard({ question, item, num, total, onDone }: {
  question: MCQuestion; item: Item; num: number; total: number
  onDone: (correct: boolean, easy?: boolean) => void
}) {
  const [picked, setPicked] = useState<number | null>(null)
  const [saved, setSaved] = useState(false)
  const answered = picked !== null
  const correct = picked === question.correctIndex

  const shuffledExamples = useMemo(() => shuffleExamples(item.examples), [item.id])

  const typeLabel = {
    'fill-blank': 'FILL IN THE BLANK',
    'meaning-match': 'MEANING',
    'sentence-judge': 'RIGHT OR WRONG?',
  }

  const url = `https://dictionary.cambridge.org/dictionary/english/${item.phrase.replace(/\s+/g, '-').replace(/'/g, '')}`

  const handleDone = (c: boolean, easy?: boolean) => {
    setSaved(true)
    setTimeout(() => onDone(c, easy), 250)
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-text-dim/50 uppercase tracking-[0.15em]">{typeLabel[question.type]}</span>
        <span className="text-[10px] text-text-dim/30">{num}/{total}</span>
      </div>

      <p className="text-[15px] leading-relaxed text-text">{question.prompt}</p>

      <div className="grid gap-2">
        {question.options.map((opt, i) => {
          let cls = 'border-border/40 hover:border-border/70'
          if (answered) {
            if (i === question.correctIndex) cls = 'border-correct/40 bg-correct/5'
            else if (i === picked) cls = 'border-wrong/40 bg-wrong/5'
            else cls = 'border-border/15 opacity-20'
          }
          const parts = opt.split('\n» ')
          return (
            <button key={i} disabled={answered} onClick={() => setPicked(i)}
              className={`w-full text-left px-4 py-3 rounded-lg border text-[13px] leading-relaxed transition-all ${cls}`}>
              {question.type === 'sentence-judge' ? (
                opt
              ) : (
                <div>
                  <span className="text-text-dim/50 mr-2">{String.fromCharCode(65 + i)})</span>
                  {parts[0]}
                  {parts[1] && <p className="text-[11px] text-text-dim/35 italic mt-1 ml-5">» {parts[1]}</p>}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className="space-y-4 animate-[slideUp_0.3s_ease-out]">
          <p className={`text-xs font-medium ${correct ? 'text-correct/80' : 'text-wrong/80'}`}>
            {correct ? '✓ Correct' : `✗ ${question.options[question.correctIndex].split('\n')[0]}`}
          </p>

          <div className="rounded-lg p-4 space-y-3 border border-border/20 bg-bg/40">
            <div className="flex justify-between items-baseline">
              <p className="text-accent text-sm font-medium">{item.phrase}</p>
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-text-dim/30 hover:text-accent transition-colors">cambridge →</a>
            </div>
            <p className="text-xs text-text/70">{item.meaning}</p>
            {item.notes && <p className="text-[11px] text-text-dim/50 leading-relaxed">{item.notes}</p>}
            <div className="space-y-1.5 pt-1">
              {shuffledExamples.map((ex, j) => (
                <p key={j} className="text-[11px] text-text-dim/45 italic pl-2.5 border-l border-border/20 leading-relaxed animate-[fadeInSlow_0.3s_ease-out]" style={{ animationDelay: `${j * 80}ms`, animationFillMode: 'backwards' }}>
                  {ex}
                </p>
              ))}
            </div>
            {item.wrongExample && (
              <p className="text-[11px] text-wrong/35 pl-2.5 border-l border-wrong/15 italic">✗ {item.wrongExample}</p>
            )}
          </div>

          {saved ? (
            <p className="text-[10px] text-correct/40 text-center animate-[fadeIn_0.2s_ease-out]">saved ✓</p>
          ) : correct ? (
            <div className="flex gap-2 animate-[fadeIn_0.2s_ease-out]">
              <button onClick={() => handleDone(true, false)}
                className="flex-1 py-2.5 rounded-lg text-xs font-medium border border-border/30 text-text-dim/50 hover:text-text/70 hover:border-border/60 transition-all active:scale-[0.98]">
                Got it →
              </button>
              <button onClick={() => handleDone(true, true)}
                className="flex-1 py-2.5 rounded-lg text-xs font-medium border border-correct/15 text-correct/50 hover:text-correct/80 hover:border-correct/30 transition-all active:scale-[0.98]">
                Easy →
              </button>
            </div>
          ) : (
            <button onClick={() => handleDone(false)}
              className="w-full py-2.5 rounded-lg text-xs font-medium border border-border/30 text-text-dim/50 hover:text-text/70 hover:border-border/60 transition-all active:scale-[0.98] animate-[fadeIn_0.2s_ease-out]">
              Next →
            </button>
          )}
        </div>
      )}
    </div>
  )
}
