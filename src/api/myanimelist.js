import popura from 'popura'
import { MYANIMELIST } from '../../env'
import { pad, padID, log } from '../util'

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
let ERRORS = []

export default class Api {
  constructor (type) {
    this.type = type.toLowerCase()
    this.limit = { anime: 35578, manga: 106857 }
    log.info(`${pad('MyAnimeList')} (${this.type}) Connected to ${MYANIMELIST.USERNAME}`)
    this.main(0)
  }

  async main (ID) {
    if (await this.ondata) {
      if (this.type === 'anime') await this.addAnime(ID)
      else if (this.type === 'manga') await this.addManga(ID)
      else {
        log.error(`${pad('MyAnimeList')} (${this.type}) Invalid media type`)
        this.onerror('Unknown type')
      }
    }

    await this.next(ID)
  }

  next (ID) {
    if (ID === this.limit[this.type]) {
      if (this.oncomplete) {
        // Dump errors
        log.info(`${pad('MyAnimeList')} (${this.type}) Finished with ${ERRORS.length} errors`)
        if (ERRORS.length) log.error(ERRORS)
        this.oncomplete()
      }
    } else this.main(++ID)
  }

  async addAnime (ID) {
    await client.addAnime(ID, options.anime)
    .then(res => {
      log.trace(`${pad('MyAnimeList')} (${this.type}) ${padID(ID)} ${res}`)
      this.ondata(`${ID} (${res})`)
    })
    .catch(async err => {
      log.debug(`${pad('MyAnimeList')} (${this.type}) ${padID(ID)} Add failed - ${err}`)
      log.trace(`${pad('MyAnimeList')} (${this.type}) ${padID(ID)} Add failed - attempting to update`)
      ERRORS.push([ID, err])
      await this.updateAnime(ID)
    })
  }

  async updateAnime (ID) {
    await client.updateAnime(ID, options.anime)
    .then(res => {
      log.trace(`${pad('MyAnimeList')} (${this.type}) ${padID(ID)} ${res}`)
      this.ondata(`${ID} (${res})`)
    })
    .catch(err => {
      if (err.statusCode === 400) {
        log.warn(`${pad('MyAnimeList')} (${this.type}) ${padID(ID)} Update failed - media may not exist`)
        this.ondata(`${ID} (Does not exist)`)
      } else {
        log.error(`${pad('MyAnimeList')} (${this.type}) ${padID(ID)} Update failed - ${err}`)
        this.ondata(`${ID} (Unknown error)`)
        ERRORS.push([ID, err])
      }
    })
  }

  async addManga (ID) {
    await client.addManga(ID, options.manga)
    .then(res => {
      log.trace(`${pad('MyAnimeList')} (${this.type}) ${padID(ID)} ${res}`)
      this.ondata(`${ID} (${res})`)
    })
    .catch(async err => {
      log.debug(`${pad('MyAnimeList')} (${this.type}) ${padID(ID)} Add failed - ${err}`)
      log.trace(`${pad('MyAnimeList')} (${this.type}) ${padID(ID)} Add failed - attempting to update`)
      ERRORS.push([ID, err])
      await this.updateManga(ID)
    })
  }

  async updateManga (ID) {
    await client.updateManga(ID, options.manga)
    .then(res => {
      log.trace(`${pad('MyAnimeList')} (${this.type}) ${padID(ID)} ${res}`)
      this.ondata(`${ID} (${res})`)
    })
    .catch(err => {
      if (err.statusCode === 400) {
        log.warn(`${pad('MyAnimeList')} (${this.type}) ${padID(ID)} Update failed - media may not exist`)
        this.ondata(`${ID} (Does not exist)`)
      } else {
        log.error(`${pad('MyAnimeList')} (${this.type}) ${padID(ID)} Update failed - ${err}`)
        this.ondata(`${ID} (Unknown error)`)
        ERRORS.push([ID, err])
      }
    })
  }
}
