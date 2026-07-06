import { useState, useEffect, useCallback } from 'react'
import { fetchStorageAnalysis } from '../services/api'
import type { DriveStorageAnalysisDto } from '../types'

export function useStorageAnalysis() {
  const [data, setData] = useState<DriveStorageAnalysisDto[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchStorageAnalysis()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch storage analysis')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return { data, error, loading, refetch: load }
}
