import popura from 'popura'
import { MYANIMELIST } from '../../env'

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
