import { useEffect } from 'react'
import { create } from 'zustand'
import { tenantConfig, TenantConfig } from '../config/tenant.config'
import { subscribeToDocument } from '../lib/firestore'

interface TenantConfigStore {
  config: TenantConfig
  loading: boolean
  setConfig: (config: TenantConfig) => void
  setLoading: (loading: boolean) => void
}

const useTenantConfigStore = create<TenantConfigStore>((set) => ({
  config: tenantConfig,
  loading: true,
  setConfig: (config) => set({ config, loading: false }),
  setLoading: (loading) => set({ loading }),
}))

function deepMerge<T extends Record<string, unknown>>(base: T, override: Partial<T>): T {
  const result = { ...base }
  for (const key in override) {
    const baseVal = base[key]
    const overrideVal = override[key]
    if (
      baseVal &&
      overrideVal &&
      typeof baseVal === 'object' &&
      typeof overrideVal === 'object' &&
      !Array.isArray(baseVal)
    ) {
      result[key] = deepMerge(
        baseVal as Record<string, unknown>,
        overrideVal as Record<string, unknown>,
      ) as T[Extract<keyof T, string>]
    } else if (overrideVal !== undefined) {
      result[key] = overrideVal as T[Extract<keyof T, string>]
    }
  }
  return result
}

export function useTenantConfig(): { config: TenantConfig; loading: boolean } {
  const { config, loading, setConfig } = useTenantConfigStore()

  useEffect(() => {
    const unsubscribe = subscribeToDocument<Partial<TenantConfig>>(
      'config/tenant',
      (overrides) => {
        if (overrides) {
          const merged = deepMerge(tenantConfig, overrides)
          setConfig(merged)
        } else {
          setConfig(tenantConfig)
        }
      },
    )
    return unsubscribe
  }, [setConfig])

  return { config, loading }
}
