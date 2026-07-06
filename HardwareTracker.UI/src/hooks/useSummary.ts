import { useState, useEffect, useCallback } from 'react'
import { fetchSummary } from '../services/api'
import type { SystemHealthSummary } from '../types'

export function useSummary() {
  const [data, setData] = useState<SystemHealthSummary | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchSummary()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch system summary')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return { data, error, loading, refetch: load }
}
