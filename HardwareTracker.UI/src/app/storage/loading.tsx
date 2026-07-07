import GlassCard from '@/components/GlassCard'

export default function StorageLoading() {
  return (
    <div className="mt-10">
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
    </div>
  )
}
