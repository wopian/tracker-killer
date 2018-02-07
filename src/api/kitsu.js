import Kitsu from 'kitsu'
import OAuth2 from 'client-oauth2'
import moment from 'moment'
import { version } from '../../package'
import { logFile, logList } from '../util'
import { KITSU } from '../env'

const api = new Kitsu({
  headers: {
    'user-agent': `trackerKiller/${version} (https://github.com/wopian/tracker-killer)`
  }
})

let userId, lastAction

export default class Api {
  constructor (type) {
    lastAction = moment()
    this.type = type.toLowerCase()
    this.setup()
  }

  async log (ID = '', action = '', last, level = 'info', err = '') {
    logFile(level, 'Kitsu', this.type, ID, action, err)
    this.ondata(logList(ID, action, last))
    lastAction = moment()
  }

  async setup () {
    if (!KITSU.USERNAME || KITSU.USERNAME === 'yourUsername' ||
        !KITSU.PASSWORD || KITSU.PASSWORD === 'yourPassword' ||
        !KITSU.CLIENT_ID || KITSU.CLIENT_ID === 'yourClientID' ||
        !KITSU.CLIENT_SECRET || KITSU.CLIENT_SECRET === 'yourClientSecret') {
      console.log('\nKitsu needs some user info to authorise\n\n' +
        '1. Rename env.template.js to env.js\n' +
        '2. Add username, password, client ID & secret for Kitsu')
      process.exit(0)
    } else this.auth()
  }

  async auth () {
    try {
      const { owner } = new OAuth2({
        clientId: KITSU.CLIENT_ID,
        clientSecret: KITSU.CLIENT_SECRET,
        accessTokenUri: 'https://kitsu.io/api/oauth/token'
      })
      const { data } = await owner.getToken(KITSU.USERNAME, KITSU.PASSWORD)
      api.headers['Authorization'] = `Bearer ${data.access_token}`
      this.log(undefined, `Connected to ${KITSU.USERNAME}`, lastAction, 'info')
      await this.getUser()
      await this.getMedia(0)
    } catch (err) {
      throw err
    }
  }

  async getUser () {
    try {
      let { id } = await api.self()
      userId = await id
      this.log(undefined, `Linked ${KITSU.USERNAME} with ${userId}`, lastAction, 'info')
    } catch (err) {
      this.log(undefined, `Error getting ID of ${KITSU.USERNAME}`, lastAction, 'error', err)
    }
  }

  async getMedia (offset) {
    try {
      const { data, links } = await api.get(this.type, {
        fields: { anime: 'id', manga: 'id' },
        page: { limit: 20, offset }
      })

      this.log(`${offset}-${offset + 20}`, 'Fetched', lastAction, 'trace')
      await this.addLibraryEntry(data)
      // Load next page if it exists
      if (links.next) await this.getMedia(offset + 20)
      else if (this.oncomplete) {
        this.log(undefined, 'Finished', undefined, 'info')
        this.oncomplete()
      }
    } catch (err) {
      this.log(`${offset}-${offset + 20}`, 'Failed', lastAction, 'error', `Error fetching media - ${JSON.stringify(err)}`)
    }
  }

  // Create a new library entry
  async addLibraryEntry (media) {
    for (let mediaEntry in await media) {
      try {
        await api.post('libraryEntries', {
          media: { type: this.type, id: media[mediaEntry].id },
          user: { id: userId },
          status: 'planned',
          progress: 0
        })

        this.log(media[mediaEntry].id, 'Added', lastAction, 'trace')
      } catch (err) {
        if (err.errors && err.errors.constructor === Array) {
          for (let error of await err.errors) {
            // User already has media in their library
            if (error.title === 'has already been taken') {
              this.log(media[mediaEntry].id, 'Exists', lastAction, 'trace', 'Already in library')
              await this.getLibraryEntry(media[mediaEntry])
            }
          }
        } else {
          this.log(media[mediaEntry].id, 'Failed', lastAction, 'error', `Error adding library entry - ${JSON.stringify(err)}`)
        }
      }
    }
  }

  // Get library entry to find its ID
  async getLibraryEntry (mediaEntry) {
    try {
      let { data } = await api.get('libraryEntries', {
        filter: { userId, kind: this.type, mediaId: mediaEntry.id },
        page: { limit: 1 }
      })
      this.log(mediaEntry.id, 'Entry', lastAction, 'trace', 'Library entry ID')
      await this.updateLibraryEntry(mediaEntry, data[0].id)
    } catch (err) {
      this.log(mediaEntry.id, 'Failed', lastAction, 'error', `Error fetching library entry - ${err}`)
    }
  }

  async updateLibraryEntry (mediaEntry, entryId) {
    try {
      api.patch('libraryEntries', {
        id: entryId,
        status: 'planned',
        progress: 0
      })
      this.log(mediaEntry.id, 'Updated', lastAction, 'trace')
    } catch (err) {
      if (err.errors && err.errors.constructor === Array) {
        err.errors.forEach(error => {
          this.log(mediaEntry.id, 'Failed', lastAction, 'error', `Error adding library entry - ${error}`)
        })
      } else this.log(mediaEntry.id, 'Failed', lastAction, 'error', `Error adding library entry - ${JSON.stringify(err)}`)
    }
  }
}
