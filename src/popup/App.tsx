import '../features'
import { getFeatures } from '@core/feature-registry'
import { FeatureToggle } from '@shared/ui/FeatureToggle'
import { t } from '@shared/utils/i18n'

export function Popup() {
  // The registry is filled by the side-effect import above, before this renders.
  // Each row's on/off state is owned by its own FeatureToggle.
  const features = getFeatures()

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
    </div>
  )
}
