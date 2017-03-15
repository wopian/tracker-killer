import chalk from 'chalk'
import pad from 'pad-left'

export const log = console.log

export function gen (size) {
  return Array.apply(null, {length: size}).map(Number.call, Number)
}

export function top (service, type, userType, userName) {
  log(chalk.blue(`${service} ${type} Library Filler`))
  log(chalk.blue(`${userType}\t${userName}\n`))
}

export function status (service, id, status) {
  const servicePadded = pad(service, 11, ' ')
  function serviceColoured () {
    switch (service) {
      case 'MyAnimeList':
        return chalk.blue(servicePadded)
    }
  }
  function statusColoured () {
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
  log(`${serviceColoured()} ${chalk.blue(pad(id, 5, ' '))} ${statusColoured()}`)
}

export const debug = process.env.DEBUG
