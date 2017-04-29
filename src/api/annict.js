import Annict from 'annict'
import { version } from '../../package'
import { pad, padID, log } from '../util'
import { ANNICT } from '../env'

const annict = new Annict()
let ERRORS = []

export default class Api {
  constructor (type) {
    this.type = type.toLowerCase()
    this.limit = { anime: 5381 }
    this.main(1)
  }

  async main (ID) {
    if (await this.ondata) {
      try {
        if (!ANNICT.PERSONAL_TOKEN) {
          console.log('\nAnnict needs a personal access token to authorise.\n\n' +
            '1. Go to https://annict.com/settings/apps\n' +
            '2. Generate a new token with \'read + write\' scopes\n' +
            '3. Copy the token to env.js, e.g:\n' +
            '   ANNICT: {\n     PERSONAL_TOKEN: \'123\'\n   }')
          process.exit(0)
        } else if (this.type === 'anime') {
          annict.client.setHeader('Authorization', `Bearer ${ANNICT.PERSONAL_TOKEN}`)
          annict.client.setHeader('User-Agent', `trackerKiller/${version} (wopian)`)
          await this.next(ID)
        } else if (this.type === 'manga') {
          this.ondata('Annict doesn\'t support manga')
          this.delete()
        } else {
          log.error(`${pad('Annict')} (${this.type}) Invalid media type`)
          this.onerror('Unknown type')
        }
      } catch (err) {
        console.log(err)
      }
    } else this.main(ID)
  }

  delete () {
    if (this.oncomplete) {
      // Dump errors
      log.info(`${pad('Annict')} (${this.type}) Finished with ${ERRORS.length} errors`)
      if (ERRORS.length) log.error(ERRORS)
      this.oncomplete()
    }
  }

  async next (ID) {
    if (ID === this.limit[this.type]) {
      this.delete()
    } else await this.addWorks(ID)
  }

  async addWorks (ID) {
    try {
      let response = await annict.Me.Status.create({ work_id: ID, kind: 'wanna_watch' })
      if (response.status === 204) {
        log.trace(`${pad('Annict')} (${this.type}) ${padID(ID)} Added`)
        this.ondata(`${ID} (Added)`)
      } else {
        log.warn(`${pad('Annict')} (${this.type}) ${padID(ID)} Added? - expected 204, but got ${response.status}`)
        this.ondata(`${ID} (Added?)`)
      }
      await this.next(++ID)
    } catch (err) {
      log.error(`${pad('Annict')} (${this.type}) ${padID(ID)} Add Failed - ${err}`)
      this.ondata(`${ID} (Failed)`)
      ERRORS.push([ID, err])
    }
  }
}
