import {MYANIMELIST} from '../env'
import chalk from 'chalk'
import pad from 'pad-left'
import Q from 'q'
import MALjs from 'MALjs'

const log = console.log

export default function myanimelist () {
    log(chalk.blue('MyAnimeList Library Filler'))
    log(chalk.blue(`user\t${MYANIMELIST.username}\n`))

    const api = new MALjs(MYANIMELIST.username, MYANIMELIST.password);
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
            const random = Math.floor(Math.random()*(850-300+1)+300).toString();

            log(padded + chalk.yellow('\trequest'))

            api.anime.add(timing, {
                status: '2', // completed
                score: '10', // watchable
                episode: random
            })
            .then(request => {
                log(padded + chalk.green('\t added'))
                deferred.resolve(timing)
            })
            .catch(err => {
                api.anime.update(timing, {
                    status: '2', // completed
                    score: '10', // watchable
                    episode: random
                })
                .then(request => {
                    log(padded + chalk.blue('\tupdated'))
                    deferred.resolve(timing)
                })
                .catch(err => {
                    log(padded + chalk.red('\tfailure'))
                    deferred.resolve(timing)
                })
            })
            clearTimeout(timer)
        }, 10)

        return deferred.promise
    }
}