export const storage = {
  async get<T>(key: string): Promise<T | undefined> {
    const res = await chrome.storage.sync.get(key)
    return res[key]
  },

  async set(data: Record<string, unknown>) {
    return chrome.storage.sync.set(data)
  },

  async remove(key: string) {
    return chrome.storage.sync.remove(key)
  },

  onChanged(callback: (changes: Record<string, chrome.storage.StorageChange>) => void) {
    chrome.storage.onChanged.addListener(callback)
  },
}
