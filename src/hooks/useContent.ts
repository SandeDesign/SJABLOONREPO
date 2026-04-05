import { useEffect, useState } from 'react'
import { subscribeToDocument } from '../lib/firestore'

interface UseContentResult<T> {
  data: T | null
  loading: boolean
}

export function useContent<T>(section: string): UseContentResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const unsubscribe = subscribeToDocument<T>(`content/${section}`, (doc) => {
      setData(doc)
      setLoading(false)
    })
    return unsubscribe
  }, [section])

  return { data, loading }
}
