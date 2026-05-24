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

const usedExamples = new Map<string, Set<number>>()

function pickExample(item: Item, filter?: (ex: string) => boolean): { text: string; index: number } | null {
  let used = usedExamples.get(item.id)
  if (!used || used.size >= item.examples.length) {
    used = new Set()
    usedExamples.set(item.id, used)
  }

  const candidates = item.examples
    .map((ex, i) => ({ text: ex, index: i }))
    .filter(e => !used!.has(e.index) && (!filter || filter(e.text)))

  if (candidates.length === 0) {
    const allMatch = item.examples
      .map((ex, i) => ({ text: ex, index: i }))
      .filter(e => !filter || filter(e.text))
    if (allMatch.length === 0) return null
    return allMatch[Math.floor(Math.random() * allMatch.length)]
  }

  const pick = candidates[Math.floor(Math.random() * candidates.length)]
  used.add(pick.index)
  return pick
}

function containsPhrase(example: string, phrase: string): boolean {
  return new RegExp(esc(phrase), 'i').test(example)
}

function fillBlank(item: Item, all: Item[]): MCQuestion | null {
  const match = pickExample(item, ex => containsPhrase(ex, item.phrase))
  if (!match) return null

  const blank = match.text.replace(new RegExp(esc(item.phrase), 'gi'), '______')
  const d = distractors(item, all, Math.min(3, all.length - 1))
  const opts = shuffle([item, ...d].map(i => i.phrase))
  return { type: 'fill-blank', itemId: item.id, prompt: blank, options: opts, correctIndex: opts.indexOf(item.phrase) }
}

function meaningWithExample(item: Item): string {
  const ex = pickExample(item)
  const text = ex?.text ?? item.examples[0]
  const short = text.length > 55 ? text.slice(0, 52) + '...' : text
  return `${item.meaning}\n» ${short}`
}

function meaningMatch(item: Item, all: Item[]): MCQuestion {
  const d = distractors(item, all, Math.min(3, all.length - 1))
  const items = shuffle([item, ...d])
  const opts = items.map(i => meaningWithExample(i))
  return { type: 'meaning-match', itemId: item.id, prompt: `What does "${item.phrase}" mean?`, options: opts, correctIndex: opts.indexOf(meaningWithExample(item)) }
}

function sentenceJudge(item: Item): MCQuestion {
  const correctEx = pickExample(item)
  const wrongEx = item.wrongExample ?? `I ${item.phrase} the table yesterday.`
  const correct = correctEx?.text ?? item.examples[0]
  const showCorrectFirst = Math.random() < 0.5
  const options = showCorrectFirst ? [correct, wrongEx] : [wrongEx, correct]
  return { type: 'sentence-judge', itemId: item.id, prompt: `Which sentence uses "${item.phrase}" correctly?`, options, correctIndex: showCorrectFirst ? 0 : 1 }
}

export function generateQuestion(item: Item, all: Item[]): MCQuestion {
  const r = Math.random()

  if (r < 0.4) {
    const fb = fillBlank(item, all)
    if (fb) return fb
  }

  if (r < 0.7) return meaningMatch(item, all)
  return sentenceJudge(item)
}
