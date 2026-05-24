import type { Item } from '../types'

type Raw = { phrase: string; meaning: string; examples: string[]; notes: string }

const data: Raw[] = [
  {
    phrase: 'break the ice',
    meaning: 'Start a conversation or ease tension in an awkward social situation',
    examples: [
      'He told a joke to break the ice at the start of the meeting.',
      "I'm terrible at breaking the ice at parties — I never know what to say.",
      'A simple compliment can break the ice with someone new.',
      'The team-building exercise was designed to break the ice between new hires.',
      'She broke the ice by asking about his dog — everyone loves talking about pets.',
    ],
    notes: 'One of the most common idioms in English. Works in any social context — meetings, dates, parties. "Icebreaker" (noun) comes from this.',
  },
  {
    phrase: 'a piece of cake',
    meaning: 'Something very easy to do',
    examples: [
      'The exam was a piece of cake — I finished in 20 minutes.',
      "Don't worry about the presentation, it'll be a piece of cake.",
      'For an experienced developer, this bug fix is a piece of cake.',
      '"How was the interview?" "Piece of cake — they loved me."',
      'Learning to ride a bike seemed hard at first, but it turned out to be a piece of cake.',
    ],
    notes: 'Very informal but universally understood. Synonym: "easy as pie." Can sound dismissive if used about someone else\'s struggle.',
  },
  {
    phrase: 'hit the nail on the head',
    meaning: 'Be exactly right about something',
    examples: [
      'You hit the nail on the head — the real problem is communication, not resources.',
      'Her analysis of the market hit the nail on the head.',
      '"We need more sleep, not more coffee." "You hit the nail on the head."',
      'The critic hit the nail on the head when he called the film "beautiful but hollow."',
      'I think you\'ve hit the nail on the head with that diagnosis.',
    ],
    notes: 'Carpentry metaphor — hitting the nail precisely. Always a compliment. Very common in both casual and professional settings.',
  },
  {
    phrase: 'bite the bullet',
    meaning: 'Force yourself to do something difficult or unpleasant that you\'ve been avoiding',
    examples: [
      'I finally bit the bullet and went to the dentist after two years.',
      'We need to bite the bullet and have that difficult conversation.',
      'She bit the bullet and quit her comfortable job to start her own business.',
      'Sometimes you just have to bite the bullet and apologize, even when it\'s hard.',
      'I\'ve been putting off this tax filing — time to bite the bullet.',
    ],
    notes: 'Origin: soldiers biting bullets during surgery without anesthesia. Implies courage and doing something painful but necessary. Very common.',
  },
  {
    phrase: 'under the weather',
    meaning: 'Feeling slightly ill or not at your best',
    examples: [
      "I'm feeling a bit under the weather today — I think I'll skip the gym.",
      'She called in sick because she was under the weather.',
      'He seemed under the weather at dinner — turns out he had a cold.',
      "I've been under the weather all week but nothing serious.",
      '"You look under the weather." "Yeah, I didn\'t sleep well."',
    ],
    notes: 'Nautical origin — sick sailors went below deck, "under the weather." Implies mild illness, not serious. Polite way to say you\'re not feeling well.',
  },
]

export const seedItems: Item[] = data.map((d, i) => ({
  ...d,
  id: `s${i + 1}`,
  type: 'idiom',
  stability: 0,
  difficulty: 5,
  reps: 0,
  lastReview: null,
  nextDue: null,
}))
