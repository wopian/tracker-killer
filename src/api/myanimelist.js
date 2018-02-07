import popura from 'popura'
import moment from 'moment'
import { logFile, logList } from '../util'
import { MYANIMELIST } from '../env'

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
let lastAction

export default class Api {
  constructor (type) {
    lastAction = moment()
    this.type = type.toLowerCase()
    this.limit = { anime: 35578, manga: 106857 }
    this.start()
  }

  async log (ID = '', action = '', last, level = 'info', err = '') {
    logFile(level, 'MyAnimeList', this.type, ID, action, err)
    this.ondata(logList(ID, action, last))
    lastAction = moment()
  }

  async start () {
    if (await this.ondata) {
      this.log(undefined, `Connected to ${MYANIMELIST.USERNAME}`, lastAction, 'info')
      this.next(0)
    } else this.start()
  }

  next (ID) {
    if (ID === this.limit[this.type]) {
      if (this.oncomplete) {
        this.log(undefined, 'Finished', undefined, 'info')
        this.oncomplete()
      }
    } else this.checkType(++ID)
  }

  async checkType (ID) {
    if (await this.ondata) {
      if (this.type === 'anime') await this.addAnime(ID)
      else if (this.type === 'manga') await this.addManga(ID)
      else {
        this.log(undefined, 'Unknown media type', lastAction, 'error')
      }
    }

    await this.next(ID)
  }

  async addAnime (ID) {
    await client.addAnime(ID, options.anime)
      .then(res => {
        this.log(ID, res, lastAction, 'trace')
      })
      .catch(async err => {
        this.log(ID, 'Exists?', lastAction, 'trace', `Attempting to update - ${err}`)

        await this.updateAnime(ID)
      })
  }

  async updateAnime (ID) {
    await client.updateAnime(ID, options.anime)
      .then(res => {
        this.log(ID, res, lastAction, 'trace')
      })
      .catch(err => {
        if (err.statusCode === 400) {
          this.log(ID, 'N/A', lastAction, 'trace', `Media may not exist - ${err}`)
        } else {
          this.log(ID, 'Failed', lastAction, 'error', `Error updating library entry - ${err}`)
        }
      })
  }

  async addManga (ID) {
    await client.addManga(ID, options.manga)
      .then(res => {
        this.log(ID, res, lastAction, 'trace')
      })
      .catch(async err => {
        this.log(ID, 'Exists?', lastAction, 'trace', `Attempting to update - ${err}`)

        await this.updateManga(ID)
      })
  }

  async updateManga (ID) {
    await client.updateManga(ID, options.manga)
      .then(res => {
        this.log(ID, res, lastAction, 'trace')
      })
      .catch(err => {
        if (err.statusCode === 400) {
          this.log(ID, 'N/A', lastAction, 'trace', `Media may not exist - ${err}`)
        } else {
          this.log(ID, 'Failed', lastAction, 'error', `Error updating library entry - ${err}`)
        }
      })
  }
}
