import chalk from 'chalk'
import pad from 'pad-left'

// Shorthand alias for logging
export const log = console.log

// Generate and fill an Array
// i.e [1, 2, 3...]
export function gen (size) {
  return Array.apply(null, { length: size })
  .map(Number.call, Number)
}

// Colourise strings for services
export function colour (string, service) {
  switch (service) {
    case 'AniList':
      return chalk.cyan(string)
    case 'Kitsu':
      return chalk.yellow(string)
    case 'MyAnimeList':
      return chalk.blue(string)
    default:
      return string
  }
}

// Print header for service to display which type and user is active
export function top (service, type, user) {
  log(colour(`${service} ${type} Library Filler\n${user}\n`, service))
}

// Print status of the API request
export function status (service, id, status) {
  let tmp = []

  function symbol () {
    switch (status) {
      case 'request':
        return chalk.grey('•')  // ╭╮
      case 'added':
        return chalk.green('•') // ╰╯
      case 'updated':
        return chalk.yellow('•')
      case 'failure':
        return chalk.red('╳')   // ┆┆
    }
  }

  // Colourise service name and left pad to align
  tmp[0] = colour(pad(service, 11, ' '), service)
  // Colourise media ID and left pad to align
  tmp[1] = colour(pad(id, 5, ' '), service)

  log(`${tmp[0]} ${tmp[1]} ${symbol()}`)
}

// Enables debug loggers when run in debug mode
export const debug = process.env.DEBUG
