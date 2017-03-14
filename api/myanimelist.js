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

    let temp = Q.when({})
    const anime = Array.apply(null, {length: 35087}).map(Number.call, Number)

    anime.forEach(element => {
        temp = temp.then(() => {
            return delay(element + 1)
        })
    })

    function delay(timing) {
        var deferred = Q.defer()

        var timer = setInterval(() => {
            const padded = pad(timing, 5, '0')

            log(padded + chalk.yellow('\trequest'))

            api.anime.add(timing, {
                status: '2' // completed
            })
            .then(result => {
                log(padded + chalk.green('\tadded'))
                deferred.resolve(timing)
            })
            .catch(err => {
                log(padded + chalk.red('\tfailed'))
                deferred.resolve(timing)
            })
            clearTimeout(timer)
        }, 100)

        return deferred.promise
    }

    /*
    while (i < 35087) {
        run()
        .then(add(i))
        .then(i++)
        .then(sleep(1000))
    }
    */
}