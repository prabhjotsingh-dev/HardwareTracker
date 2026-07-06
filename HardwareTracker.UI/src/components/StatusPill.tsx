interface StatusPillProps {
  health: string
}

const healthStyles: Record<string, string> = {
  Optimal: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Critical: 'bg-red-500/15 text-red-400 border-red-500/30',
}

export default function StatusPill({ health }: StatusPillProps) {
  const style = healthStyles[health] ?? healthStyles.Optimal
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide ${style}`}>
      <span
        className="h-2 w-2 rounded-full bg-current shadow-[0_0_8px_currentColor]"
        style={{ animation: 'pulse-dot 2s infinite' }}
      />
      {health} Health
    </span>
  )
}
