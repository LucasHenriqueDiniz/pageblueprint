import { registerFeature } from '@core/feature-registry'
import { logger } from '@core/logger'

registerFeature({
  id: 'example-feature',
  name: 'Example Feature',
  description: 'A sample feature to demonstrate the system',
  defaultEnabled: false,
  run: () => {
    logger.log('Example feature is running')
  },
  cleanup: () => {
    logger.log('Example feature is cleaning up')
  },
})
