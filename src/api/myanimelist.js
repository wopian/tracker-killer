import popura from 'popura'
import { MYANIMELIST } from '../../env'

/*
export default class Api {
  constructor () {
    let i = 0
    this._id = setInterval(() => this.emit(i++), 200)
  }

  emit (n) {
    const limit = 20
    if (this.ondata) this.ondata(`Requesting ${n}`)
    if (n === limit) {
      if (this.oncomplete) this.oncomplete()
      this.destroy()
    }
  }

  destroy () {
    clearInterval(this._id)
  }
}
*/
const client = popura(MYANIMELIST.USERNAME, MYANIMELIST.PASSWORD)
const options = {
  anime: {
    episode: 0,
    status: 'plantowatch',
    score: 0,
    storage_type: 0,
    storage_value: 0,
    times_rewatched: 0,
    rewatch_value: 0,
    priority: 0,
    enable_discussion: 0,
    enable_rewatching: 0,
    comments: '',
    fansub_group: '',
    tags: []
  },
  manga: {
    chapter: 0,
    volume: 0,
    status: 'plantoread',
    score: 0,
    times_reread: 0,
    reread_value: 0,
    priority: 0,
    enable_discussion: 0,
    enable_rereading: 0,
    comments: '',
    scan_group: '',
    tags: [],
    retail_volumes: 0
  }
}

export default class Api {
  constructor (type) {
    this.type = type.toLowerCase()
    this.limit = { anime: 36000, manga: 110000 }
    this.getMedia(0)
  }

  async getMedia (ID) {
    if (await this.ondata) {
      if (this.type === 'anime') {
        await client.addAnime(ID, options.anime)
        .then(async res => {
          await this.ondata(res)
        })
        .catch(async () => {
          await client.updateAnime(ID, options.anime)
          .then(async res => {
            await this.ondata(`${ID} (${res})`)
          })
          .catch(async err => {
            if (err.message === 'Response code 400 (Bad Request)') {
              await this.ondata(`${ID} (Does not exist)`)
            } else console.error(err)
          })
        })
      } else if (this.type === 'manga') {
        await client.addManga(ID, options.manga)
        .then(async res => {
          await this.ondata(res)
        })
        .catch(async () => {
          await client.updateManga(ID, options.manga)
          .then(async res => {
            await this.ondata(`${ID} (${res})`)
          })
          .catch(async err => {
            if (err.message === 'Response code 400 (Bad Request)') {
              await this.ondata(`${ID} (Does not exist)`)
            } else console.error(err)
          })
        })
      } else await this.onerror('Unknown type')
    }
    if (ID === await this.limit[this.type]) {
      if (this.oncomplete) await this.oncomplete()
    } else await this.getMedia(++ID)
  }
}

/*
async function api (service, media) {
  const client = popura(MYANIMELIST.USERNAME, MYANIMELIST.PASSWORD)
}
*/

/*
import Q from 'q'
import MALjs from 'MALjs'
import { gen, top, debug, status } from '../util'
import { MYANIMELIST } from '../../env'

const api = new MALjs(MYANIMELIST.username, MYANIMELIST.password)

export default function myanimelist (service, type, observer) {
  // top(service, type, MYANIMELIST.username)

  observer.next('Hello world')

  switch (type) {
    case ('Anime'):
      anime(service, type)
      break
    case ('Manga'):
      manga(service, type)
      break
  }
}

function anime (service, type) {
  let next = Q.when({})

  // myanimelist.net/anime.php?o=9&c%5B0%5D=a&c%5B1%5D=d&cv=2
  gen(36000).forEach(id => {
    next = next.then(() => {
      return queue(id + 1)
    })
  })

  function queue (id) {
    const deferred = Q.defer()
    const sleep = setInterval(() => {
      // status(service, type, id, 'request')

      api.anime.add(id, {
        status: 6, // plantowatch
        score: 0,
        episode: 0
      })
      .then(request => {
        // status(service, type, id, 'add')
        deferred.resolve(id)
      })
      .catch(err => {
        if (debug) { status(service, type, id, 'fail') }
        api.anime.update(id, {
          status: 6, // plantowatch
          score: 0,
          chapter: 0
        })
        .then(request => {
          // status(service, type, id, 'update')
          deferred.resolve(id)
        })
        .catch(err => {
          // status(service, type, id, 'fail')
          deferred.resolve(id)
        })
      })

      clearTimeout(sleep)
    }, 10)

    return deferred.promise
  }
}

function manga (service, type) {
  let next = Q.when({})

  // myanimelist.net/manga.php?o=9&c%5B0%5D=a&c%5B1%5D=d&cv=2
  gen(110000).forEach(id => {
    next = next.then(() => {
      return queue(id + 1)
    })
  })

  function queue (id) {
    const deferred = Q.defer()
    const sleep = setInterval(() => {
      // status(service, type, id, 'request')

      api.manga.add(id, {
        status: 6, // plantowatch
        score: 0,
        chapter: 0
      })
      .then(request => {
        // status(service, type, id, 'add')
        deferred.resolve(id)
      })
      .catch(err => {
        if (debug) { status(service, type, id, 'fail') }
        api.manga.update(id, {
          status: 6, // plantowatch
          score: 0,
          chapter: 0
        })
        .then(request => {
          // status(service, type, id, 'update')
          deferred.resolve(id)
        })
        .catch(err => {
          // status(service, type, id, 'fail')
          deferred.resolve(id)
        })
      })

      clearTimeout(sleep)
    }, 10)

    return deferred.promise
  }
}
*/
