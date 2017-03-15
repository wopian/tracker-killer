import { KITSU } from '../env'
import { log } from '../util'
import chalk from 'chalk'
import axios from 'axios'

export default function kitsu () {
  log(chalk.blue('Kitsu Library Filler'))
  log(chalk.blue(`user\t${KITSU.username}\n`))

  const auth = axios({
    headers: {
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json'
    }
  })
}
