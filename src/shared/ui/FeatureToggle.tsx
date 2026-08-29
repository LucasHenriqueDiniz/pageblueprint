import { useState, useEffect } from 'react'
import { isFeatureEnabled, setFeatureEnabled } from '@core/feature-registry'
import { ToggleButton } from './ToggleButton'

export function FeatureToggle({ id }: { id: string }) {
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    isFeatureEnabled(id).then((value) => {
      setEnabled(value)
      setLoading(false)
    })
  }, [id])

  const handleToggle = async (value: boolean) => {
    setEnabled(value)
    await setFeatureEnabled(id, value)
  }

  if (loading) {
    return <div className="h-6 w-11 animate-pulse rounded-full bg-gray-200" />
  }

  return <ToggleButton enabled={enabled} onToggle={handleToggle} />
}
