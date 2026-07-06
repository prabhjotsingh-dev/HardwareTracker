import GlassCard from '../components/GlassCard'

export default function Privacy() {
  return (
    <div>
      <div className="mt-10 mb-10">
        <h1 className="m-0 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-4xl font-bold text-transparent">
          Privacy Policy
        </h1>
        <p className="mb-0 text-sm text-gray-400">HardwareTracker diagnostics telemetry and privacy disclosure</p>
      </div>

      <GlassCard>
        <p>
          HardwareTracker Diagnostics operates entirely locally on your machine. All system telemetry, CPU load, memory
          stats, and storage analysis data are processed strictly on your hardware and never leave your local environment.
        </p>
      </GlassCard>
    </div>
  )
}
