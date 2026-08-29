import { logger } from '@core/logger'
import { onMessage } from '@core/messaging'
import { runFeatures } from '@core/feature-registry'
import '../features'

logger.info('Background service worker started')

onMessage((msg, _sender, sendResponse) => {
  logger.log('Message received:', msg)
  sendResponse({ ok: true })
})

runFeatures().catch(logger.error)
