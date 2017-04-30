import Annict from 'annict'
import moment from 'moment'
import { version } from '../../package'
import { logFile, logList } from '../util'
import { ANNICT } from '../env'

const annict = new Annict()
let lastAction

export default class Api {
  constructor (type) {
    lastAction = moment()
    this.type = type.toLowerCase()
    this.limit = { anime: 5381 }
    this.main(1)
  }

  async log (ID = '', action = '', last, level = 'info', err = '') {
    logFile(level, 'Annict', this.type, ID, action, err)
    this.ondata(logList(ID, action, last))
    lastAction = moment()
  }

  async main (ID) {
    if (await this.ondata) {
      this.setup(ID)
    } else this.main(ID)
  }

  async setup (ID) {
    try {
      // Prevent service from running if token hasn't been set
      if (!ANNICT.PERSONAL_TOKEN || ANNICT.PERSONAL_TOKEN === 'yourPersonalToken') {
        console.log('\nAnnict needs a personal access token to authorise.\n\n' +
          '1. Go to https://annict.com/settings/apps\n' +
          '2. Generate a new token with \'read + write\' scopes\n' +
          '3. Copy the token to env.js, e.g:\n' +
          '   ANNICT: {\n     PERSONAL_TOKEN: \'123\'\n   }')
        process.exit(0)
      }

      if (this.type === 'anime') {
        annict.client.setHeader('Authorization', `Bearer ${ANNICT.PERSONAL_TOKEN}`)
        annict.client.setHeader('User-Agent', `trackerKiller/${version} (wopian)`)
        this.log(undefined, `Connected to NOT IMPLEMENTED`, lastAction, 'info')
        await this.next(ID)
      } else if (this.type === 'manga') {
        this.log(undefined, `Annict doesn't support manga`, lastAction, 'info')
        this.exit()
      } else {
        this.log(undefined, 'Unknown media type', lastAction, 'error')
      }
    } catch (err) {
      this.log(undefined, 'Unknown error', lastAction, 'error', err)
    }
  }

  exit () {
    if (this.oncomplete) {
      this.log(undefined, 'Finished', undefined, 'info')
      this.oncomplete()
    }
  }

  async next (ID) {
    if (ID === this.limit[this.type]) {
      this.exit()
    } else await this.addWorks(++ID)
  }

  async addWorks (ID) {
    try {
      let response = await annict.Me.Status.create({ work_id: ID, kind: 'wanna_watch' })
      if (response.status === 204) {
        this.log(ID, 'Added', lastAction, 'trace')
      } else if (response.status === 404) {
        this.log(ID, 'N/A', lastAction, 'trace', `Media may not exist`)
      } else {
        this.log(ID, 'Added?', lastAction, 'warn', `Expected 204, but got ${response.status}`)
      }
      await this.next(ID)
    } catch (err) {
      this.log(ID, 'Failed', lastAction, 'error', `Error adding library entry - ${err}`)
    }
  }
}
