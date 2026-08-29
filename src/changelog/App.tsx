import { t } from '@shared/utils/i18n'
import { useState } from 'react'

const releases = [
  {
    version: '1.0.0',
    date: '2026-04-28',
    changes: [
      { type: 'feat', text: 'Initial release' },
      { type: 'feat', text: 'Popup with feature toggles' },
      { type: 'feat', text: 'Feature registry system' },
    ],
  },
]

function Badge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    feat: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    fix: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    chore: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    refactor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  }
  const labels: Record<string, string> = {
    feat: t('changelog_type_feat'),
    fix: t('changelog_type_fix'),
    chore: t('changelog_type_chore'),
    refactor: t('changelog_type_refactor'),
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[type] || colors.chore}`}>
      {labels[type] || type}
    </span>
  )
}

export function Changelog() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggle = (version: string) => {
    setExpanded((prev) => ({ ...prev, [version]: !prev[version] }))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t('app_name')}
        </h1>
        <h2 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-6">
          {t('changelog_title')}
        </h2>

        <div className="space-y-4">
          {releases.map((release) => (
            <div
              key={release.version}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => toggle(release.version)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    v{release.version}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {release.date}
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    expanded[release.version] ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {expanded[release.version] && (
                <div className="px-4 pb-4 space-y-2">
                  {release.changes.map((change, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Badge type={change.type} />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {change.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {releases.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            {t('changelog_empty')}
          </p>
        )}
      </div>
    </div>
  )
}
