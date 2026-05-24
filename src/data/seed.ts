import type { Idiom } from '../types'

const r = (phrase: string, meaning: string, example: string, category: Idiom['category'], difficulty: Idiom['difficulty']) =>
  ({ phrase, meaning, example, category, difficulty }) as const

const raw = [
  r('low-hanging fruit', 'Easy wins that require minimal effort', "Let's tackle the low-hanging fruit first — onboarding copy fixes will boost activation today.", 'founder', 1),
  r('move the needle', 'Make a significant measurable impact', "Adding dark mode won't move the needle — focus on the retention loop.", 'founder', 1),
  r('pull the trigger', 'Make a decisive action or final commitment', "We've tested enough — time to pull the trigger on the Stripe integration.", 'founder', 1),
  r('ship it', 'Release the product or feature to users', "It's 80% there and users need it now — just ship it.", 'founder', 1),
  r("the writing's on the wall", 'Signs clearly indicate what will happen', "The writing's on the wall — if churn stays at 15%, we're dead in 6 months.", 'founder', 2),
  r('boil the ocean', 'Attempt something impossibly ambitious', "Don't boil the ocean with an AI feature set — start with one use case.", 'founder', 2),
  r('drink the Kool-Aid', 'Blindly believe in something without questioning', "Don't drink the Kool-Aid on every YC trend — validate with your own users.", 'founder', 2),
  r('go to market', 'Launch a product commercially for the first time', "Our go-to-market strategy is content-led — zero paid ads until PMF.", 'founder', 1),
  r('ramen profitable', 'Earning just enough revenue to cover basic living costs', "We hit ramen profitable at $2K MRR — enough to skip the fundraising circus.", 'founder', 2),
  r('hockey stick growth', 'Sudden exponential growth after a flat period', "Month 8 hit hockey stick growth — word of mouth finally kicked in.", 'founder', 2),
  r('land grab', 'Aggressively capture market share before competitors', "AI content tools are in land-grab mode — first to nail creator UX wins.", 'founder', 2),
  r('build a moat', 'Create a sustainable competitive advantage', "Our data flywheel is the moat — every user makes the AI smarter for all.", 'founder', 2),
  r('race to the bottom', 'Competing primarily by lowering prices unsustainably', "Competing on price is a race to the bottom — differentiate on workflow.", 'founder', 2),
  r('table stakes', 'The minimum requirements to compete', "Mobile support is table stakes now — not a feature, a baseline.", 'founder', 1),
  r('PMF', 'Product-market fit — when a product satisfies strong market demand', "You know you have PMF when users complain about downtime instead of features.", 'founder', 1),

  r('hit the nail on the head', 'Describe exactly what is right or true', "You hit the nail on the head — the real problem is onboarding, not pricing.", 'colloquial', 1),
  r('back to square one', 'Return to the starting point after a setback', "The API migration failed, so we're back to square one.", 'colloquial', 1),
  r('cut to the chase', 'Get to the point without wasting time', "Let me cut to the chase — we need $5K MRR by September or we pivot.", 'colloquial', 1),
  r('on the same page', 'Having shared understanding or agreement', "Before we build, let's get on the same page about the user persona.", 'colloquial', 1),
  r('drop the ball', 'Fail to follow through on a responsibility', "I dropped the ball on the email sequence — zero follow-ups went out.", 'colloquial', 1),
  r('rule of thumb', 'A practical guideline based on experience, not exact science', "Rule of thumb: if the feature takes more than a week, split it.", 'colloquial', 1),
  r('elephant in the room', 'An obvious problem no one wants to discuss', "The elephant in the room is that our free tier cannibalizes paid.", 'colloquial', 1),
  r('raise the bar', 'Set a higher standard', "Notion raised the bar for documentation UX — we need to match it.", 'colloquial', 1),
  r('cut corners', 'Do something in a cheaper or easier way, sacrificing quality', "We cut corners on testing and it cost us a full day of downtime.", 'colloquial', 1),
  r('moving the goalposts', 'Changing the criteria for success unfairly', "The investor keeps moving the goalposts — first ARR, now cohort retention.", 'colloquial', 2),
  r('burn bridges', 'Destroy relationships permanently through actions', "Don't burn bridges with your co-founder — the startup world is small.", 'colloquial', 1),
  r('calling the shots', 'Making the important decisions', "As a solo founder, you're calling the shots — own every outcome.", 'colloquial', 1),
  r('circle back', 'Return to discuss something later', "Let's circle back on the pricing page after we see this week's data.", 'colloquial', 1),
  r('no-brainer', 'An extremely easy decision', "At $10/month for unlimited AI calls, it's a no-brainer for creators.", 'colloquial', 1),
  r('throw in the towel', 'Give up or admit defeat', "Three pivots in, most founders would throw in the towel — we kept going.", 'colloquial', 1),

  r('skin in the game', 'Personal stake or risk in the outcome', "Advisors without skin in the game give generic advice — give them equity.", 'business', 2),
  r('moving fast', 'Executing with high speed and urgency', "We're moving fast — shipping weekly, measuring daily, iterating hourly.", 'business', 1),
  r('lean in', 'Embrace a challenge or opportunity with full commitment', "The AI hype is real — lean in now while distribution is cheap.", 'business', 1),
  r('stay in your lane', "Focus on your area of expertise, don't overreach", "I stay in my lane — product and growth. Legal goes to the lawyer.", 'business', 1),
  r('wear many hats', 'Handle multiple different roles or responsibilities', "Solo founders wear many hats — I'm the dev, designer, and support team.", 'business', 1),
  r('open the kimono', 'Share confidential or internal information transparently', "We opened the kimono on our metrics — full transparency builds trust.", 'business', 3),
  r('off the beaten path', 'Unconventional or less commonly taken approach', "Our distribution strategy is off the beaten path — no ads, pure community.", 'business', 2),
  r('ahead of the curve', 'More advanced or innovative than others', "Building AI tools in 2024 put us ahead of the curve for the creator wave.", 'business', 1),
  r('behind the eight ball', 'In a difficult or disadvantaged position', "Missing the Product Hunt launch put us behind the eight ball on visibility.", 'business', 3),
  r('moving target', 'A goal or requirement that keeps changing', "User expectations for AI quality are a moving target — ship fast, adapt faster.", 'business', 2),
  r('in the weeds', 'Deeply involved in details, potentially losing the big picture', "I got in the weeds with CSS tweaks — should've focused on conversion.", 'business', 2),
  r('level the playing field', 'Make conditions equal for everyone', "AI tools level the playing field — a solo creator can compete with agencies.", 'business', 2),
  r('second-guess', 'Doubt or reconsider a decision after making it', "Don't second-guess the pricing change — the data supports it.", 'business', 1),
  r('shoot from the hip', 'Act or speak impulsively without careful thought', "I shot from the hip on that tweet and it went viral — sometimes instinct works.", 'business', 2),
  r('play hardball', 'Act tough and uncompromising in negotiations', "The enterprise client tried to play hardball on pricing — we held firm.", 'business', 2),
]

export const seedIdioms: Idiom[] = raw.map((item, i) => ({
  ...item,
  id: `s${i + 1}`,
  status: 'new',
  correct: 0,
  wrong: 0,
  lastSeen: null,
  nextDue: null,
}))
