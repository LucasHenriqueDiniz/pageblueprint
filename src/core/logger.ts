import { config } from './config'

const prefix = `[${config.name}]`

export const logger = {
  log: (...args: unknown[]) => {
    if (config.debug) console.log(prefix, ...args)
  },
  warn: (...args: unknown[]) => {
    if (config.debug) console.warn(prefix, ...args)
  },
  error: (...args: unknown[]) => {
    console.error(prefix, ...args)
  },
  info: (...args: unknown[]) => {
    if (config.debug) console.info(prefix, ...args)
  },
}
