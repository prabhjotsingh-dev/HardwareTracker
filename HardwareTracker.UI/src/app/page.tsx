'use client'

import Link from 'next/link'
import { useSummary } from '@/hooks/useSummary'
import GlassCard from '@/components/GlassCard'
import StatusPill from '@/components/StatusPill'
import ProgressBar from '@/components/ProgressBar'
import DriveCard from '@/components/DriveCard'

export default function DashboardPage() {
  const { data: summary, error, loading, refetch } = useSummary()

  return (
    <div>
      <div className="mt-10 mb-10 flex items-center justify-between">
        <div>
          <h1 className="m-0 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-4xl font-bold text-transparent">
            Live System Diagnostics
          </h1>
          <p className="mb-0 text-sm text-gray-400">Real-time hardware telemetry and health monitoring</p>
        </div>
        <button
          onClick={refetch}
          disabled={loading}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2.5 font-semibold text-gray-900 no-underline shadow-lg shadow-cyan-400/20 transition-all hover:-translate-y-0.5 hover:shadow-cyan-400/35 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 4v6h-6" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          {loading ? 'Refreshing...' : 'Refresh Telemetry'}
        </button>
      </div>

      {loading && (
        <GlassCard>
          <div className="py-8 text-center text-gray-400">Loading system telemetry...</div>
        </GlassCard>
      )}

      {error && (
        <div
          className="mb-6 flex items-center gap-4 rounded-2xl border border-amber-500/40 bg-amber-500/15 p-5 text-amber-200"
          role="alert"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="shrink-0 text-amber-400" viewBox="0 0 16 16">
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
          </svg>
          <div>
            <h5 className="mb-1 font-semibold">Backend Connection Offline</h5>
            <p className="mb-0">{error}</p>
          </div>
        </div>
      )}

      {summary && (
        <>
          <GlassCard className="mb-6 border-cyan-400/20">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <StatusPill health={summary.overallHealth} />
                <span className="text-sm text-gray-400">{summary.statusMessage}</span>
              </div>
              <span className="font-mono-jet text-xs text-gray-400">
                LAST SYNC: {new Date(summary.lastUpdated).toLocaleTimeString()}
              </span>
            </div>
          </GlassCard>

          <div className="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <GlassCard>
              <div className="card-icon-title mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10 text-lg text-cyan-400">🖥️</div>
                <h3 className="m-0 text-lg font-semibold text-gray-100">Host Machine</h3>
              </div>
              <div className="font-mono-jet text-3xl font-bold text-white">{summary.machineName}</div>
              <div className="mb-3 text-xs uppercase tracking-wide text-gray-400">Computer Hostname</div>
              <hr className="my-4 border-white/10" />
              <div className="flex justify-between text-sm text-gray-400">
                <span>Operating System:</span>
                <span className="font-mono-jet text-gray-100">{summary.osVersion}</span>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="card-icon-title mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10 text-lg text-cyan-400">⚡</div>
                <h3 className="m-0 text-lg font-semibold text-gray-100">Processor (CPU)</h3>
              </div>
              <div className="font-mono-jet text-2xl font-bold text-white">{summary.processorName}</div>
              <div className="mb-3 text-xs uppercase tracking-wide text-gray-400">Active CPU Architecture</div>
              <hr className="my-4 border-white/10" />
              <div className="flex justify-between text-sm text-gray-400">
                <span>Physical Cores:</span>
                <span className="font-mono-jet text-gray-100">{summary.physicalCores} Cores</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Logical Threads:</span>
                <span className="font-mono-jet text-gray-100">{summary.logicalCores} Threads</span>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="card-icon-title mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10 text-lg text-cyan-400">🧠</div>
                <h3 className="m-0 text-lg font-semibold text-gray-100">Memory Allocation (RAM)</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <div className="font-mono-jet text-3xl font-bold text-white">{summary.usedMemoryGb} GB</div>
                <span className="font-mono-jet text-sm text-gray-400">/ {summary.totalMemoryGb} GB Total</span>
              </div>
              <div className="mb-3 text-xs uppercase tracking-wide text-gray-400">System RAM Utilization</div>
              <ProgressBar value={summary.memoryUsagePercentage} />
              <div className="mt-2 flex justify-between text-xs text-gray-400">
                <span>Available: {summary.availableMemoryGb} GB</span>
                <span className="font-mono-jet text-gray-100">{summary.memoryUsagePercentage}% Used</span>
              </div>
            </GlassCard>
          </div>

          <div className="mb-6 grid gap-6">
            <GlassCard>
              <div className="card-icon-title mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10 text-lg text-cyan-400">💾</div>
                <h3 className="m-0 text-lg font-semibold text-gray-100">Storage Subsystem &amp; Drive Telemetry</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {summary.drives.map((drive) => (
                  <DriveCard key={drive.name} drive={drive} />
                ))}
              </div>
            </GlassCard>
          </div>

          <div className="mb-6 text-center">
            <Link
              href="/storage"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2.5 font-semibold text-gray-900 no-underline shadow-lg shadow-cyan-400/20 transition-all hover:-translate-y-0.5 hover:shadow-cyan-400/35"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              Analyze Storage Usage
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
