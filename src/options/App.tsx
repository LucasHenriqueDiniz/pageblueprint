import { t } from '@shared/utils/i18n'

export function Options() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t('app_name')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Configure your extension settings here.
        </p>
      </div>
    </div>
  )
}
