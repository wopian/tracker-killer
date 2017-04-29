import logger from 'simple-node-logger'
import leftPad from 'left-pad'

const argv = require('yargs').argv

// Longest service name (MyAnimeList = 11)
export const pad = str => leftPad(str, 11)
// Pad ID values
export const padID = str => leftPad(str, 6)

export const log = logger.createRollingFileLogger({
  logDirectory: `${__dirname}/../../`,
  // fileNamePattern: 'tracker-killer-<date>.log',
  fileNamePattern: 'tracker-killer.log',
  dateFormat: 'YYYY-MM-DD',
  timestampFormat: 'YYYY-MM-DD hh:mm:ss.SSS'
})

if (argv._.includes('ALL')) log.setLevel('all')
if (argv._.includes('TRACE')) log.setLevel('TRACE')
if (argv._.includes('DEBUG')) log.setLevel('debug')
// if (argv._.includes('INFO')) log.setLevel('info') // Default
if (argv._.includes('WARN')) log.setLevel('warn')
if (argv._.includes('ERROR')) log.setLevel('error')
if (argv._.includes('FATAL')) log.setLevel('fatal')

/*
log.trace('this is a simple trace log statement (should not show)')
log.debug('this is a simple debug log statement (should not show)')
log.info('this is a simple info log statement/entry')
log.warn('this is a simple warn log statement/entry')
log.error('this is a simple error log statement/entry')
log.fatal('this is a simple fatal log statement/entry')
*/
