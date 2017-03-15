import chalk from 'chalk'

export const log = console.log

export function gen (size) {
  return Array.apply(null, {length: size}).map(Number.call, Number)
}

export function top (service, type, userType, userName) {
  log(chalk.blue(`${service} ${type} Library Filler`))
  log(chalk.blue(`${userType}\t${userName}\n`))
}
