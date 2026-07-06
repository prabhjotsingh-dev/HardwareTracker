import type { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
}

export default function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_12px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(0,242,254,0.1)] ${className}`}
    >
      <div className="pointer-events-none absolute left-0 top-0 h-[3px] w-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {children}
    </div>
  )
}
