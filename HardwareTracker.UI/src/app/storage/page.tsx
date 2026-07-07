'use client'

import { useStorageAnalysis } from '@/hooks/useStorageAnalysis'
import GlassCard from '@/components/GlassCard'

const catColorMap: Record<string, string> = {
  'cat-system': 'bg-gray-400',
  'cat-applications': 'bg-blue-500',
  'cat-appdata': 'bg-cyan-500',
  'cat-documents': 'bg-amber-400',
  'cat-music': 'bg-emerald-500',
  'cat-videos': 'bg-red-500',
  'cat-pictures': 'bg-violet-500',
  'cat-downloads': 'bg-yellow-400',
  'cat-desktop': 'bg-indigo-500',
  'cat-other': 'bg-gray-500',
}

export default function StorageAnalysisPage() {
  const { data, error, loading, refetch } = useStorageAnalysis()

  return (
    <div>
      <div className="mt-10 mb-10 flex items-center justify-between">
        <div>
          <h1 className="m-0 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-4xl font-bold text-transparent">
            Storage Analysis
          </h1>
          <p className="mb-0 text-sm text-gray-400">Detailed breakdown of what's consuming disk space by category</p>
        </div>
        <button
          onClick={refetch}
          disabled={loading}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2.5 font-semibold text-gray-900 shadow-lg shadow-cyan-400/20 transition-all hover:-translate-y-0.5 hover:shadow-cyan-400/35 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 4v6h-6" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          {loading ? 'Scanning...' : 'Refresh Scan'}
        </button>
      </div>

      {error && (
        <div
          className="mb-6 flex items-center gap-4 rounded-2xl border border-amber-500/40 bg-amber-500/15 p-5 text-amber-200"
          role="alert"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="shrink-0 text-amber-400" viewBox="0 0 16 16">
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
          </svg>
          <div>
            <h5 className="mb-1 font-semibold">Error</h5>
            <p className="mb-0">{error}</p>
          </div>
        </div>
      )}

      {loading && (
        <GlassCard>
          <div className="py-8 text-center">
            <div
              className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent"
              role="status"
            />
            <h4 className="text-lg text-gray-100">Scanning storage drives...</h4>
            <p className="mb-0 text-sm text-gray-400">Analyzing folder sizes and file types. This may take a moment.</p>
          </div>
        </GlassCard>
      )}

      {!loading && data && data.length > 0 && (
        <div className="grid gap-6">
          <GlassCard>
            <div className="card-icon-title mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10 text-lg text-cyan-400">📊</div>
              <h3 className="m-0 text-lg font-semibold text-gray-100">Storage Breakdown by Category</h3>
            </div>

            {data.map((analysis, idx) => (
              <div key={analysis.driveName}>
                <div className="mb-4 rounded-xl bg-white/[0.02] p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="mb-0 text-base font-semibold text-gray-100">
                      <span className="font-mono-jet mr-2 rounded-md border border-white/15 bg-dark/50 px-2 py-0.5 text-sm text-cyan-400">
                        {analysis.driveName}
                      </span>
                      {analysis.totalUsedGb} GB Used &middot; {analysis.freeSpaceGb} GB Free (of {analysis.totalSizeGb} GB)
                    </h4>
                    <span className="font-mono-jet text-xs text-gray-400">
                      {analysis.categories.length} categories
                    </span>
                  </div>

                  {analysis.categories.length > 0 && (
                    <>
                      <div className="mb-3 flex h-6 overflow-hidden rounded-lg bg-white/5">
                        {analysis.categories.map((cat) => (
                          <div
                            key={cat.categoryName}
                            className={`min-w-[2px] transition-all duration-500 ${catColorMap[cat.colorClass] || 'bg-gray-500'}`}
                            style={{ width: `${cat.percentageOfUsed}%` }}
                            title={`${cat.categoryName}: ${cat.totalSizeGb} GB (${cat.percentageOfUsed}%)`}
                          />
                        ))}
                      </div>

                      <div className="flex flex-col gap-1">
                        {analysis.categories.map((cat) => (
                          <div
                            key={cat.categoryName}
                            className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-white/[0.04]"
                          >
                            <span className={`h-2.5 w-2.5 shrink-0 rounded-sm ${catColorMap[cat.colorClass] || 'bg-gray-500'}`} />
                            <span className="flex-1 font-medium text-gray-100">{cat.categoryName}</span>
                            <span className="font-mono-jet min-w-[70px] text-right font-semibold text-gray-100">{cat.totalSizeGb} GB</span>
                            <span className="font-mono-jet min-w-[50px] text-right text-gray-400">{cat.percentageOfUsed}%</span>
                            <span className="font-mono-jet min-w-[100px] text-right text-xs text-gray-400">{cat.fileCount.toLocaleString()} files</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-2 text-xs text-gray-400">
                        Last scanned: {new Date(analysis.lastScanned).toLocaleString()}
                      </div>
                    </>
                  )}

                  {analysis.categories.length === 0 && (
                    <p className="py-2 text-sm text-gray-400">No analysis data available for this drive.</p>
                  )}
                </div>
                {idx < data.length - 1 && <hr className="my-4 border-white/10" />}
              </div>
            ))}
          </GlassCard>
        </div>
      )}

      {!loading && data && data.length === 0 && (
        <GlassCard>
          <div className="py-8 text-center">
            <p className="mb-0 text-sm text-gray-400">No storage analysis data available.</p>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
