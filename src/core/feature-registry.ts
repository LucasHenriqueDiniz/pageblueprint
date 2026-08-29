import { storage } from './storage'

export type Feature = {
  id: string
  name: string
  description?: string
  defaultEnabled?: boolean
  run?: () => void | Promise<void>
  cleanup?: () => void | Promise<void>
}

const features: Feature[] = []

export const registerFeature = (feature: Feature) => {
  features.push(feature)
}

export const getFeatures = () => features

export const isFeatureEnabled = async (id: string): Promise<boolean> => {
  const feature = features.find(f => f.id === id)
  const stored = await storage.get<boolean>(`feature:${id}`)
  return stored !== undefined ? stored : (feature?.defaultEnabled ?? false)
}

export const setFeatureEnabled = async (id: string, enabled: boolean) => {
  await storage.set({ [`feature:${id}`]: enabled })
}

export const runFeatures = async () => {
  for (const feature of features) {
    const enabled = await isFeatureEnabled(feature.id)
    if (enabled && feature.run) {
      await feature.run()
    }
  }
}
