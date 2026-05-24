import { useState } from 'react'
import { MCQuestion as MCQ } from '../types'
import OptionButton from './OptionButton'

const typeLabel = { 'fill-blank': 'FILL IN THE BLANK', 'meaning-match': 'MEANING MATCH', 'context-usage': 'CONTEXT USAGE' }

export default function MCQuestion({ question, num, total, onAnswer }: { question: MCQ; num: number; total: number; onAnswer: (correct: boolean) => void }) {
  const [picked, setPicked] = useState<number | null>(null)
  const answered = picked !== null

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-xs text-accent font-semibold tracking-wider">{typeLabel[question.type]}</span>
        <span className="text-xs text-text-dim">{num}/{total}</span>
      </div>
      <p className="text-lg leading-relaxed">{question.prompt}</p>
      <div className="grid gap-2">
        {question.options.map((opt, i) => {
          let state: 'default' | 'correct' | 'wrong' | 'dimmed' = 'default'
          if (answered) {
            if (i === question.correctIndex) state = 'correct'
            else if (i === picked) state = 'wrong'
            else state = 'dimmed'
          }
          return (
            <OptionButton
              key={i}
              label={opt}
              index={i}
              state={state}
              disabled={answered}
              onClick={() => { setPicked(i); onAnswer(i === question.correctIndex) }}
            />
          )
        })}
      </div>
      {answered && (
        <div className={`text-sm font-medium ${picked === question.correctIndex ? 'text-correct' : 'text-wrong'}`}>
          {picked === question.correctIndex ? '✓ Correct!' : `✗ Wrong — answer was ${String.fromCharCode(65 + question.correctIndex)}`}
        </div>
      )}
    </div>
  )
}
