import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchStorageAnalysis } from '@/services/api'
import type { DriveStorageAnalysisDto } from '@/types/types'

interface CacheEntry {
  data: DriveStorageAnalysisDto[]
  timestamp: number
}

const cache = new Map<string, CacheEntry>()

export function useStorageAnalysis(drive?: string) {
  const [data, setData] = useState<DriveStorageAnalysisDto[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const load = useCallback(async (isBackground = false) => {
    if (abortRef.current) {
      abortRef.current.abort()
    }
    abortRef.current = new AbortController()

    if (!isBackground) {
      setLoading(true)
      setError(null)
    }
    try {
      const result = await fetchStorageAnalysis(drive)
      const key = drive ?? '__all__'
      cache.set(key, { data: result, timestamp: Date.now() })
      setData(result)
    } catch (err) {
      if (!isBackground) {
        setError(err instanceof Error ? err.message : 'Failed to fetch storage analysis')
      }
    } finally {
      if (!isBackground) {
        setLoading(false)
      }
      setRefreshing(false)
    }
  }, [drive])

  useEffect(() => {
    const key = drive ?? '__all__'
    const cached = cache.get(key)
    if (cached) {
      setData(cached.data)
      setLoading(false)
      setRefreshing(true)
      load(true)
    } else {
      setLoading(true)
      load(false)
    }

    return () => {
      if (abortRef.current) {
        abortRef.current.abort()
      }
    }
  }, [load, drive])

  const refetch = useCallback(() => {
    const key = drive ?? '__all__'
    const cached = cache.get(key)
    if (cached) {
      setData(cached.data)
      setRefreshing(true)
      load(true)
    } else {
      setLoading(true)
      load(false)
    }
  }, [drive, load])

  return { data, error, loading, refreshing, refetch }
}
