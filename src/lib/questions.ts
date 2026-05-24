import type { Item, MCQuestion } from '../types'

function shuffle<T>(a: T[]): T[] {
  const c = [...a]
  for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [c[i], c[j]] = [c[j], c[i]] }
  return c
}

function esc(s: string) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }

function distractors(target: Item, all: Item[], n: number) {
  return shuffle(all.filter(i => i.id !== target.id)).slice(0, Math.min(n, all.length - 1))
}

function fillBlank(item: Item, all: Item[]): MCQuestion {
  const ex = item.examples[Math.floor(Math.random() * item.examples.length)]
  const blank = ex.replace(new RegExp(esc(item.phrase), 'gi'), '______')
  const d = distractors(item, all, 3)
  const opts = shuffle([item, ...d].map(i => i.phrase))
  return { type: 'fill-blank', itemId: item.id, prompt: blank, options: opts, correctIndex: opts.indexOf(item.phrase) }
}

function meaningMatch(item: Item, all: Item[]): MCQuestion {
  const d = distractors(item, all, 3)
  const opts = shuffle([item, ...d].map(i => i.meaning))
  return { type: 'meaning-match', itemId: item.id, prompt: `What does "${item.phrase}" mean?`, options: opts, correctIndex: opts.indexOf(item.meaning) }
}

export function generateQuestion(item: Item, all: Item[]): MCQuestion {
  return Math.random() < 0.55 ? fillBlank(item, all) : meaningMatch(item, all)
}
