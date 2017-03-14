import env from '../env'
import sleep from 'thread-sleep'
import chalk from 'chalk'
import pad from 'pad-left'
import Q from 'q'
import MALjs from 'MALjs'

const log = console.log

export default function myanimelist () {
    log(chalk.blue('MyAnimeList Library Filler'))
    log(chalk.blue(`user\t${env.username}\n`))

    const api = new MALjs(env.username, env.password);
    let i = 1;

    function add (i) {
        const deferred = Q.defer()
        const padded = pad(i, 5, '0')

        log(`${padded}\t${chalk.yellow('request')}`)

        api.anime.add(i, {
            status: '2' // completed
        })
        .then(result => {
            log(`${padded}\t${chalk.green('added')}`)
            deferred.resolve();
        })
        .catch(err => update(i))

        return deferred.promise
    }

    function update(i) {
        const deferred = Q.defer()
        const padded = pad(i, 5, '0')

        log(`${padded}\t${chalk.magenta('update')}`)

        api.anime.update(i, {
            status: '2' // completed
        })
        .then(result => {
            log(`${padded}\t${chalk.green('updated')}`)
            deferred.resolve();
        })
        .catch(err => log(`${padded}\t${chalk.red('failed')}`))

        return deferred.promise
    }

    function run () {
        var deferred = Q.defer();
        deferred.resolve();
        return deferred.promise;
    }

    while (i < 35087) {
        run()
        .then(add(i))
        .then(i++)
        .then(sleep(1000))
    }
}