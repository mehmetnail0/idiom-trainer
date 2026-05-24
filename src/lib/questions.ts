import type { Item, MCQuestion } from '../types'

function shuffle<T>(a: T[]): T[] {
  const c = [...a]
  for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [c[i], c[j]] = [c[j], c[i]] }
  return c
}

function esc(s: string) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }

function distractors(target: Item, all: Item[], n: number): Item[] {
  return shuffle(all.filter(i => i.id !== target.id)).slice(0, Math.min(n, all.length - 1))
}

function fillBlank(item: Item, all: Item[]): MCQuestion {
  const ex = item.examples[Math.floor(Math.random() * item.examples.length)]
  const blank = ex.replace(new RegExp(esc(item.phrase), 'gi'), '______')
  const d = distractors(item, all, Math.min(3, all.length - 1))
  const opts = shuffle([item, ...d].map(i => i.phrase))
  return { type: 'fill-blank', itemId: item.id, prompt: blank, options: opts, correctIndex: opts.indexOf(item.phrase) }
}

function meaningWithExample(item: Item): string {
  const short = item.examples[0].length > 60 ? item.examples[0].slice(0, 57) + '...' : item.examples[0]
  return `${item.meaning}\n» ${short}`
}

function meaningMatch(item: Item, all: Item[]): MCQuestion {
  const d = distractors(item, all, Math.min(3, all.length - 1))
  const items = shuffle([item, ...d])
  const opts = items.map(i => meaningWithExample(i))
  return { type: 'meaning-match', itemId: item.id, prompt: `What does "${item.phrase}" mean?`, options: opts, correctIndex: opts.indexOf(meaningWithExample(item)) }
}

function sentenceJudge(item: Item): MCQuestion {
  const correctEx = item.examples[Math.floor(Math.random() * item.examples.length)]
  const wrongEx = item.wrongExample ?? `I ${item.phrase} the table yesterday.`
  const showCorrectFirst = Math.random() < 0.5
  const options = showCorrectFirst ? [correctEx, wrongEx] : [wrongEx, correctEx]
  return {
    type: 'sentence-judge',
    itemId: item.id,
    prompt: `Which sentence uses "${item.phrase}" correctly?`,
    options,
    correctIndex: showCorrectFirst ? 0 : 1,
  }
}

export function generateQuestion(item: Item, all: Item[]): MCQuestion {
  const r = Math.random()
  if (r < 0.4) return fillBlank(item, all)
  if (r < 0.7) return meaningMatch(item, all)
  return sentenceJudge(item)
}
