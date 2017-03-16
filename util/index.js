import chalk from 'chalk'
import pad from 'pad-left'
import moment from 'moment'

// Shorthand alias for logging
export const log = console.log

// Generate and fill an Array
// i.e [1, 2, 3...]
export function gen (size) {
  return Array.apply(null, { length: size })
  .map(Number.call, Number)
}

// Colourise strings for services
export function colour (string, service, shorthand) {
  switch (service) {
    case 'AniDB':
      return shorthand
        ? chalk.white('AD')
        : chalk.white(string)
    case 'AniList':
      return shorthand
        ? chalk.cyan('AL')
        : chalk.cyan(string)
    case 'AnimePlanet':
      return shorthand
        ? chalk.magenta.dim('AP')
        : chalk.magenta.dim(string)
    case 'Annict':
      return shorthand
        ? chalk.red.dim('AN')
        : chalk.red.dim(string)
    case 'Kitsu':
      return shorthand
        ? chalk.yellow.dim('KS')
        : chalk.yellow.dim(string)
    case 'MyAnimeList':
      return shorthand
        ? chalk.blue.dim('ML')
        : chalk.blue.dim(string)
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
        return chalk.grey('⊷')  // ╭╮
      case 'add':
        return chalk.green('⊶') // ╰╯
      case 'update':
        return chalk.yellow('⊶')
      case 'fail':
        return chalk.red('⊶')   // ┆┆
      default:
        return chalk.red(' ╳')
    }
  }

  // Colourise service name and left pad to align
  tmp[0] = colour(pad(service, 11, ' '), service, true)
  // Colourise media ID and left pad to align
  tmp[1] = colour(pad(id, 5, ' '), service)

  log(`${moment().format('HH:mm:ss.SSS')} ${tmp[0]} ${tmp[1]} ${symbol()}`)
}

// Enables debug loggers when run in debug mode
export const debug = process.env.DEBUG
