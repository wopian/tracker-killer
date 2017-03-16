import Q from 'q'
import MALjs from 'MALjs'
import { gen, top, debug, status } from '../util'
import { MYANIMELIST } from '../env'

const api = new MALjs(MYANIMELIST.username, MYANIMELIST.password)

export default function myanimelist (service, type) {
  top(service, type, MYANIMELIST.username)

  switch (type) {
    case ('Anime'):
      anime(service)
      break
    case ('Manga'):
      manga(service)
      break
  }
}

function anime (service) {
  let next = Q.when({})

  // myanimelist.net/anime.php?o=9&c%5B0%5D=a&c%5B1%5D=d&cv=2
  gen(35087).forEach(id => {
    next = next.then(() => {
      return queue(id + 1)
    })
  })

  function queue (id) {
    const deferred = Q.defer()
    const sleep = setInterval(() => {
      status(service, id, 'request')

      api.anime.add(id, {
        status: 6, // plantowatch
        score: 5,
        episode: 0
      })
      .then(request => {
        status(service, id, 'added')
        deferred.resolve(id)
      })
      .catch(err => {
        if (debug) { status(service, id, 'failure') }
        api.anime.update(id, {
          status: 6, // plantowatch
          score: 5,
          chapter: 0
        })
        .then(request => {
          status(service, id, 'updated')
          deferred.resolve(id)
        })
        .catch(err => {
          status(service, id, 'failure')
          deferred.resolve(id)
        })
      })

      clearTimeout(sleep)
    }, 10)

    return deferred.promise
  }
}

function manga (service) {
  let next = Q.when({})

  // myanimelist.net/manga.php?o=9&c%5B0%5D=a&c%5B1%5D=d&cv=2
  gen(105273).forEach(id => {
    next = next.then(() => {
      return queue(id + 1)
    })
  })

  function queue (id) {
    const deferred = Q.defer()
    const sleep = setInterval(() => {
      status(service, id, 'request')

      api.manga.add(id, {
        status: 6, // plantowatch
        score: 5,
        chapter: 0
      })
      .then(request => {
        status(service, id, 'added')
        deferred.resolve(id)
      })
      .catch(err => {
        if (debug) { status(service, id, 'failure') }
        api.manga.update(id, {
          status: 6, // plantowatch
          score: 5,
          chapter: 0
        })
        .then(request => {
          status(service, id, 'updated')
          deferred.resolve(id)
        })
        .catch(err => {
          status(service, id, 'failure')
          deferred.resolve(id)
        })
      })

      clearTimeout(sleep)
    }, 10)

    return deferred.promise
  }
}
