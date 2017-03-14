import env from '../env'
import sleep from 'thread-sleep'
import chalk from 'chalk'
import pad from 'pad-left'
import MALjs from 'MALjs'

const log = console.log

export default function myanimelist () {
    log(chalk.blue('MyAnimeList Library Filler'))
    log(chalk.blue(`user\t${env.username}\n`))
    var api = new MALjs(env.username, env.password);

    function add (i) {
        const padded = pad(i, 5, '0')

        log(`${padded}\t${chalk.yellow('request')}`)
        api.anime.add(i, {
            status: '2' // completed
        })
        .then(result => log(`${padded}\t${chalk.green('added')}`))
        .catch(err => update(i))
    }

    function update(i) {
        const padded = pad(i, 5, '0')

        log(`${padded}\t${chalk.magenta('update')}`)
        api.anime.update(i, {
            status: '2' // completed
        })
        .then(result => log(`${padded}\t${chalk.green('updated')}`))
        .catch(err => log(`${padded}\t${chalk.red('failed')}`))
    }

    // for (let i = 1; i < 35087; i++) {
    for (let i = 1; i < 5; i++) {
        add(i)
        sleep(1000)
    }
}