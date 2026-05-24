import type { Item } from '../types'

const idioms: Omit<Item, 'id' | 'stability' | 'difficulty' | 'reps' | 'lastReview' | 'nextDue'>[] = [
  {
    type: 'idiom',
    phrase: 'break the ice',
    meaning: 'Start a conversation or ease tension in an awkward social situation',
    examples: [
      'He told a joke to break the ice at the meeting.',
      'A simple compliment can break the ice with someone new.',
      'The game was designed to break the ice between new hires.',
    ],
    wrongExample: 'I broke the ice in my coffee because it was too cold.',
    notes: '"Icebreaker" (noun) comes from this. Works in any social context.',
  },
  {
    type: 'idiom',
    phrase: 'bite the bullet',
    meaning: 'Do something difficult or unpleasant that you\'ve been avoiding',
    examples: [
      'I finally bit the bullet and went to the dentist.',
      'Sometimes you have to bite the bullet and apologize.',
      'She bit the bullet and quit her job to start a business.',
    ],
    wrongExample: 'He bit the bullet while eating lunch at the cafeteria.',
    notes: 'Origin: soldiers biting bullets during surgery. Implies courage.',
  },
  {
    type: 'idiom',
    phrase: 'hit the nail on the head',
    meaning: 'Be exactly right about something',
    examples: [
      'You hit the nail on the head — the issue is communication.',
      'Her analysis hit the nail on the head.',
      '"We need rest, not coffee." "You hit the nail on the head."',
    ],
    wrongExample: 'He hit the nail on the head while building a shelf in the garage.',
    notes: 'Carpentry metaphor. Always a compliment.',
  },
  {
    type: 'idiom',
    phrase: 'a piece of cake',
    meaning: 'Something very easy to do',
    examples: [
      'The exam was a piece of cake — finished in 20 minutes.',
      '"How was the interview?" "Piece of cake."',
      'For her, running 5K is a piece of cake.',
    ],
    wrongExample: 'She bought a piece of cake from the bakery for dessert.',
    notes: 'Very informal. Synonym: "easy as pie." Can sound dismissive.',
  },
  {
    type: 'idiom',
    phrase: 'under the weather',
    meaning: 'Feeling slightly ill or not at your best',
    examples: [
      "I'm feeling under the weather — I'll skip the gym today.",
      'She called in sick because she was under the weather.',
      '"You look under the weather." "Yeah, bad sleep."',
    ],
    wrongExample: 'We sat under the weather because it was raining outside.',
    notes: 'Nautical origin. Implies mild illness, not serious.',
  },
]

const words: Omit<Item, 'id' | 'stability' | 'difficulty' | 'reps' | 'lastReview' | 'nextDue'>[] = [
  {
    type: 'word',
    phrase: 'inevitable',
    meaning: 'Certain to happen; unavoidable',
    examples: [
      'Change is inevitable in any growing company.',
      'It was inevitable that the news would leak.',
      'Mistakes are inevitable when you\'re learning something new.',
    ],
    wrongExample: 'The weather was very inevitable today, sunny and warm.',
    notes: 'Adjective. "Inevitably" (adverb) is equally common. Formal but widely used.',
  },
  {
    type: 'word',
    phrase: 'leverage',
    meaning: 'Use something to maximum advantage; power or influence',
    examples: [
      'We need to leverage our existing user base for growth.',
      'She used her experience as leverage in the negotiation.',
      'Social media is a tool you can leverage to build an audience.',
    ],
    wrongExample: 'I leveraged the door open with my hand to walk inside.',
    notes: 'Noun and verb. Very common in business. "Leverage your strengths."',
  },
  {
    type: 'word',
    phrase: 'subtle',
    meaning: 'Fine, delicate, or not immediately obvious',
    examples: [
      'There\'s a subtle difference between confidence and arrogance.',
      'The flavor is subtle — you might miss it if you eat too fast.',
      'She gave a subtle hint that she wasn\'t interested.',
    ],
    wrongExample: 'The explosion was very subtle and destroyed the building.',
    notes: 'The "b" is silent: /ˈsʌt.əl/. "Subtlety" (noun). Opposite: obvious, blatant.',
  },
  {
    type: 'word',
    phrase: 'resilient',
    meaning: 'Able to recover quickly from difficulties; tough',
    examples: [
      'Children are remarkably resilient — they bounce back fast.',
      'Building a resilient business means planning for the worst.',
      'She\'s incredibly resilient — nothing keeps her down for long.',
    ],
    wrongExample: 'The rubber was resilient, so it broke immediately when stretched.',
    notes: '"Resilience" (noun). Used for people, systems, materials. Always positive.',
  },
  {
    type: 'word',
    phrase: 'compelling',
    meaning: 'Very convincing or fascinating; impossible to ignore',
    examples: [
      'She made a compelling argument for changing our strategy.',
      'The documentary tells a compelling story about ocean pollution.',
      'There\'s no compelling reason to stay — let\'s move on.',
    ],
    wrongExample: 'The boring lecture was so compelling that everyone fell asleep.',
    notes: '"Compel" (verb) = force. "Compelling" is softer — persuasive, not forceful.',
  },
]

export const seedItems: Item[] = [...idioms, ...words].map((d, i) => ({
  ...d,
  id: `s${i + 1}`,
  stability: 0,
  difficulty: 5,
  reps: 0,
  lastReview: null,
  nextDue: null,
}))
