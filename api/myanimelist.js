import {MYANIMELIST} from '../env'
import {log, gen} from '../util'
import chalk from 'chalk'
import pad from 'pad-left'
import Q from 'q'
import MALjs from 'MALjs'

const api = new MALjs(MYANIMELIST.username, MYANIMELIST.password);

export default function myanimelist (type) {
    log(type)
    log(chalk.blue('MyAnimeList Library Filler'))
    log(chalk.blue(`user\t${MYANIMELIST.username}\n`))

    switch (type) {
        case('Anime'):
            anime()
            break
        case('Manga'):
            manga()
            break
    }
}

function anime () {
    let i = 1
    let temp = Q.when({})

    // myanimelist.net/anime.php?o=9&c%5B0%5D=a&c%5B1%5D=d&cv=2
    gen(35087).forEach(element => {
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

function manga () {
    let i = 1
    let temp = Q.when({})
    
    // myanimelist.net/manga.php?o=9&c%5B0%5D=a&c%5B1%5D=d&cv=2
    gen(105273).forEach(element => {
        temp = temp.then(() => {
            return delay(element + 1)
        })
    })

    function delay(timing) {
        var deferred = Q.defer()

        var timer = setInterval(() => {
            const padded = pad(timing, 5, '0')
            const random = Math.floor(Math.random()*(350-250+1)+250).toString();

            log(padded + chalk.yellow('\trequest'))

            api.manga.add(timing, {
                status: '2', // completed
                score: '10', // watchable
                chapter: random
            })
            .then(request => {
                log(padded + chalk.green('\t added'))
                deferred.resolve(timing)
            })
            .catch(err => {
                api.manga.update(timing, {
                    status: '2', // completed
                    score: '10', // watchable
                    chapter: random
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