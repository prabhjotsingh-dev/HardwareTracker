interface ProgressBarProps {
  value: number
  warningThreshold?: number
  criticalThreshold?: number
}

export default function ProgressBar({ value, warningThreshold = 80, criticalThreshold = 90 }: ProgressBarProps) {
  const color =
    value > criticalThreshold
      ? 'bg-gradient-to-r from-red-500 to-red-700'
      : value > warningThreshold
        ? 'bg-gradient-to-r from-amber-400 to-amber-600'
        : 'bg-gradient-to-r from-cyan-400 to-blue-500'

  return (
    <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  )
}
