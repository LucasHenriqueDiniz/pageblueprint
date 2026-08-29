import { useSyncExternalStore, useCallback } from 'react'
import { storage } from '@core/storage'

export function useStorage<T>(key: string, defaultValue: T) {
  const getSnapshot = useCallback(() => {
    return defaultValue
  }, [defaultValue])

  const subscribe = useCallback(
    (callback: () => void) => {
      const listener = (changes: Record<string, chrome.storage.StorageChange>) => {
        if (key in changes) {
          callback()
        }
      }
      storage.onChanged(listener)
      return () => {
        chrome.storage.onChanged.removeListener(listener)
      }
    },
    [key]
  )

  useSyncExternalStore(subscribe, getSnapshot)

  const setValue = useCallback(
    async (value: T) => {
      await storage.set({ [key]: value })
    },
    [key]
  )

  return { setValue }
}
