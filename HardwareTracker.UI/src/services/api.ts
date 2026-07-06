import type { SystemHealthSummary, DriveStorageAnalysisDto } from '../types'

const BASE = 'http://localhost:5181'

export async function fetchSummary(): Promise<SystemHealthSummary> {
  const res = await fetch(`${BASE}/api/hardware/summary`)
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)
  return res.json()
}

export async function fetchStorageAnalysis(): Promise<DriveStorageAnalysisDto[]> {
  const res = await fetch(`${BASE}/api/hardware/storage-analysis`)
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)
  return res.json()
}
