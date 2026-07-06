import type { DriveInfoDto } from '../types'
import ProgressBar from './ProgressBar'

interface DriveCardProps {
  drive: DriveInfoDto
}

export default function DriveCard({ drive }: DriveCardProps) {
  return (
    <div className="mb-4 rounded-xl border border-white/5 bg-white/[0.03] p-4 last:mb-0">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono-jet rounded-md border border-white/15 bg-dark/50 px-2 py-0.5 text-sm text-cyan-400">
            {drive.name}
          </span>
          <span className="font-medium text-gray-100">{drive.label}</span>
        </div>
        <span className="rounded bg-gray-600/50 px-2 py-0.5 text-xs text-gray-300">{drive.driveType}</span>
      </div>
      <div className="mt-3 flex justify-between text-sm text-gray-400">
        <span>Used: {drive.usedSpaceGb} GB</span>
        <span>Total: {drive.totalSizeGb} GB</span>
      </div>
      <ProgressBar value={drive.usagePercentage} warningThreshold={85} criticalThreshold={90} />
      <div className="mt-1 flex justify-between text-xs text-gray-400">
        <span>Free: {drive.freeSpaceGb} GB</span>
        <span className="font-mono-jet text-gray-100">{drive.usagePercentage}%</span>
      </div>
    </div>
  )
}
