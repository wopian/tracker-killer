import chalk from 'chalk'
import pad from 'pad-left'

export const log = console.log

export function gen (size) {
  return Array.apply(null, {length: size}).map(Number.call, Number)
}

export function colourService (string, service) {
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

export function top (service, type, user) {
  log(colourService(`${service} ${type} Library Filler\n${user}\n`, service))
}

export function status (service, id, status) {
  function symbols () {
    switch (status) {
      case 'request':
        return chalk.grey('•') // ╭╮
      case 'added':
        return chalk.green('•') // ╰╯
      case 'updated':
        return chalk.yellow('•')
      case 'failure':
        return chalk.red('╳') // ┆┆
    }
  }
  log(`${colourService(pad(service, 11, ' '), service)} ${colourService(pad(id, 5, ' '), service)} ${symbols()}`)
}

export const debug = process.env.DEBUG
