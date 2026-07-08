import type { SystemHealthSummary, DriveStorageAnalysisDto } from '@/types/types'

export async function fetchSummary(): Promise<SystemHealthSummary> {
  const res = await fetch('/api/hardware/summary')
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)
  return res.json()
}

export async function fetchStorageAnalysis(drive?: string): Promise<DriveStorageAnalysisDto[]> {
  const params = drive ? `?drive=${encodeURIComponent(drive)}` : ''
  const res = await fetch(`/api/hardware/storage-analysis${params}`)
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)
  return res.json()
}

export async function fetchDrives(): Promise<string[]> {
  const res = await fetch('/api/hardware/drives')
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)
  return res.json()
}
