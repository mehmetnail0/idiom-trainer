type Props = {
  label: string
  index: number
  state: 'default' | 'correct' | 'wrong' | 'dimmed'
  disabled: boolean
  onClick: () => void
}

const styles = {
  default: 'bg-card-hover border-border active:scale-[0.98]',
  correct: 'bg-correct/15 border-correct',
  wrong: 'bg-wrong/15 border-wrong',
  dimmed: 'bg-card-hover border-border opacity-50',
}

export default function OptionButton({ label, index, state, disabled, onClick }: Props) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all ${styles[state]}`}
    >
      <span className="text-text-dim mr-2 font-semibold">{String.fromCharCode(65 + index)})</span>
      {label}
    </button>
  )
}
