import logger from 'simple-node-logger'
import pad from 'pad'
import moment from 'moment'

const argv = require('yargs').argv

export const diff = lastAction => pad(moment().diff(lastAction, 'seconds', true) + 's', 6)

export const logFile = (level, service, type, ID, action, err) => {
  let message = `${pad(service, 11)} ${type} ${pad(12, ID)} ${pad(action, 8)} ${err}`
  switch (level) {
    case 'trace':
      log.trace(message)
      break
    case 'debug':
      log.debug(message)
      break
    case 'warn':
      log.warn(message)
      break
    case 'error':
      log.error(message)
      break
    case 'fatal':
      log.fatal(message)
      break
    default:
      log.info(message)
      break
  }
}

export const logList = (ID, action, lastAction) => `${pad(ID.toString(), 12)} ${pad(action, 12)} ${diff(lastAction)}`

export const log = logger.createRollingFileLogger({
  logDirectory: `${__dirname}/../../`,
  fileNamePattern: 'tracker-killer-<date>.log',
  dateFormat: 'YYYYMMDD',
  timestampFormat: 'YYYY-MM-DD hh:mm:ss.SSS'
})

if (argv._.includes('ALL')) log.setLevel('all')
if (argv._.includes('TRACE')) log.setLevel('TRACE')
if (argv._.includes('DEBUG')) log.setLevel('debug')
// if (argv._.includes('INFO')) log.setLevel('info') // Default
if (argv._.includes('WARN')) log.setLevel('warn')
if (argv._.includes('ERROR')) log.setLevel('error')
if (argv._.includes('FATAL')) log.setLevel('fatal')
