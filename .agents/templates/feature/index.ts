import { registerFeature } from '@core/feature-registry'
import { logger } from '@core/logger'

registerFeature({
  id: '{{FEATURE_ID}}',
  name: '{{FEATURE_NAME}}',
  description: '{{FEATURE_DESCRIPTION}}',
  defaultEnabled: false,
  run: () => {
    logger.log('{{FEATURE_NAME}} is running')
  },
  cleanup: () => {
    logger.log('{{FEATURE_NAME}} is cleaning up')
  },
})
