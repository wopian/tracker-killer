import { MYANIMELIST } from '../env'
import { log, gen, top } from '../util'
import chalk from 'chalk'
import pad from 'pad-left'
import Q from 'q'
import MALjs from 'MALjs'

const api = new MALjs(MYANIMELIST.username, MYANIMELIST.password)

export default function myanimelist (type) {
  top('MyAnimeList', type, 'user', MYANIMELIST.username)
  switch (type) {
    case ('Anime'):
      anime()
      break
    case ('Manga'):
      manga()
      break
  }
}

function anime () {
  let next = Q.when({})

    // myanimelist.net/anime.php?o=9&c%5B0%5D=a&c%5B1%5D=d&cv=2
  gen(35087).forEach(id => {
    next = next.then(() => {
      return queue(id + 1)
    })
  })

  function queue (id) {
    var deferred = Q.defer()

    var sleep = setInterval(() => {
      const padded = pad(id, 5, '0')
      const random = Math.floor(Math.random() * (850 - 300 + 1) + 300).toString()

      log(padded + chalk.yellow('\trequest'))

      api.anime.add(id, {
        status: '2', // completed
        score: '10', // watchable
        episode: random
      })
      .then(request => {
        log(padded + chalk.green('\t added'))
        deferred.resolve(id)
      })
      .catch(err => {
        log(padded + chalk.red(`\tfailure\t\t${err}`))
        api.anime.update(id, {
          status: '2', // completed
          score: '10', // watchable
          episode: random
        })
          .then(request => {
            log(padded + chalk.blue('\tupdated'))
            deferred.resolve(id)
          })
          .catch(err => {
            log(padded + chalk.red(`\tfailure\t\t${err}`))
            deferred.resolve(id)
          })
      })
      clearTimeout(sleep)
    }, 10)

    return deferred.promise
  }
}

function manga () {
  let next = Q.when({})

    // myanimelist.net/manga.php?o=9&c%5B0%5D=a&c%5B1%5D=d&cv=2
  gen(105273).forEach(id => {
    next = next.then(() => {
      return queue(id + 1)
    })
  })

  function queue (id) {
    var deferred = Q.defer()

    var sleep = setInterval(() => {
      const padded = pad(id, 5, '0')
      const random = Math.floor(Math.random() * (350 - 250 + 1) + 250).toString()

      log(padded + chalk.yellow('\trequest'))

      api.manga.add(id, {
        status: '2', // completed
        score: '10', // watchable
        chapter: random
      })
            .then(request => {
              log(padded + chalk.green('\t added'))
              deferred.resolve(id)
            })
            .catch(err => {
              log(padded + chalk.red(`\tfailure\t\t${err}`))
              api.manga.update(id, {
                status: '2', // completed
                score: '10', // watchable
                chapter: random
              })
                .then(request => {
                  log(padded + chalk.blue('\tupdated'))
                  deferred.resolve(id)
                })
                .catch(err => {
                  log(padded + chalk.red(`\tfailure\t\t${err}`))
                  deferred.resolve(id)
                })
            })
      clearTimeout(sleep)
    }, 10)

    return deferred.promise
  }
}
