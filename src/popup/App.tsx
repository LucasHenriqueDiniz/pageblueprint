import { useEffect, useState } from 'react'
import '../features'
import { getFeatures, isFeatureEnabled } from '@core/feature-registry'
import { FeatureToggle } from '@shared/ui/FeatureToggle'
import { t } from '@shared/utils/i18n'

export function Popup() {
  const [features, setFeatures] = useState(getFeatures())

  useEffect(() => {
    const load = async () => {
      const list = getFeatures()
      const withStatus = await Promise.all(
        list.map(async (f) => ({
          ...f,
          enabled: await isFeatureEnabled(f.id),
        }))
      )
      setFeatures(withStatus)
    }
    load()
  }, [])

  return (
    <div className="w-[300px] p-4 bg-white dark:bg-gray-900">
      <h1 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
        {t('app_name')}
      </h1>

      <div className="space-y-3">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {feature.name}
              </p>
              {feature.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {feature.description}
                </p>
              )}
            </div>
            <FeatureToggle id={feature.id} />
          </div>
        ))}
      </div>

      {features.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
          No features registered yet.
        </p>
      )}

      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => chrome.tabs.create({ url: chrome.runtime.getURL('changelog.html') })}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          {t('changelog_title')} →
        </button>
      </div>
    </div>
  )
}
