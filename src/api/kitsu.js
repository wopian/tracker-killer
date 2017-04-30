import OAuth2 from 'client-oauth2'
import JsonApi from 'devour-client'
import moment from 'moment'
import { version } from '../../package'
import { logFile, logList } from '../util'
import { KITSU } from '../env'

const baseUrl = 'https://kitsu.io/api'
const Kitsu = new JsonApi({
  apiUrl: `${baseUrl}/edge`,
  logger: false
})

let auth, userId, lastAction

Kitsu.headers['User-Agent'] = `trackerKiller/${version} (wopian)`

Kitsu.define('user', {}, { collectionPath: 'users' })
Kitsu.define('anime', {}, { collectionPath: 'anime' })
Kitsu.define('manga', {}, { collectionPath: 'manga' })
Kitsu.define('libraryEntry', {
  status: '',
  progress: '',
  rating: '',
  media: {
    jsonApi: 'hasOne',
    type: 'anime' | 'manga'
  },
  user: {
    jsonApi: 'hasOne',
    type: 'users'
  }
}, { collectionPath: 'library-entries' })

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
    auth = await new OAuth2({
      clientId: KITSU.CLIENT_ID,
      clientSecret: KITSU.CLIENT_SECRET,
      accessTokenUri: `${baseUrl}/oauth/token`
    })

    let { accessToken } = await auth.owner.getToken(KITSU.USERNAME, KITSU.PASSWORD)
    Kitsu.headers['Authorization'] = await `Bearer ${accessToken}`
    this.log(undefined, `Connected to ${KITSU.USERNAME}`, lastAction, 'info')

    await this.getUser()
    await this.getMedia(0)
  }

  async getUser () {
    try {
      let response = await Kitsu.findAll('user', {
        fields: { users: 'id' },
        filter: { name: KITSU.USERNAME },
        page: { limit: 1 }
      })

      userId = await response[0].id

      this.log(undefined, `Linked ${KITSU.USERNAME} with ${userId}`, lastAction, 'info')
    } catch (err) {
      this.log(undefined, `Error getting ID of ${KITSU.USERNAME}`, lastAction, 'error', err)
    }
  }

  async getMedia (offset) {
    let response

    try {
      response = await Kitsu.findAll(this.type, {
        fields: { anime: 'id', manga: 'id' },
        page: { limit: 20, offset }
      })

      this.log(`${offset}-${offset + 20}`, 'Fetched', lastAction, 'trace')

      await this.addLibraryEntry(response)
      // Load next page if it exists
      if (response.links.next) await this.getMedia(offset + 20)
      else if (this.oncomplete) {
        this.log(undefined, 'Finished', undefined, 'info')
        this.oncomplete()
      }
    } catch (err) {
      this.log(`${offset}-${offset + 20}`, 'Failed', lastAction, 'error', `Error fetching media - ${err}`)
    }
  }

  // Create a new library entry
  async addLibraryEntry (media) {
    for (let mediaEntry of await media) {
      try {
        await Kitsu.create('libraryEntry', {
          media: { type: this.type, id: mediaEntry.id },
          user: { id: userId },
          status: 'planned',
          progress: 0,
          ratingTwenty: 'null'
        })

        this.log(mediaEntry.id, 'Added', lastAction, 'trace')
      } catch (err) {
        // User already has media in their library
        if (await err.animeId === 'has already been taken' || await err.mangaId === 'has already been taken') {
          this.log(mediaEntry.id, 'Exists', lastAction, 'trace', 'Already in library')

          await this.getLibraryEntry(mediaEntry)
        } else {
          this.log(mediaEntry.id, 'Failed', lastAction, 'error', `Error adding library entry - ${err}`)
        }
      }
    }
  }

  // Get library entry to find its ID
  async getLibraryEntry (mediaEntry) {
    try {
      let response = await Kitsu.findAll('libraryEntry', {
        filter: { userId, kind: this.type, mediaId: mediaEntry.id },
        page: { limit: 1 }
      })

      this.log(mediaEntry.id, 'Entry', lastAction, 'trace', 'Library entry ID')

      await this.updateLibraryEntry(mediaEntry, response[0].id)
    } catch (err) {
      this.log(mediaEntry.id, 'Failed', lastAction, 'error', `Error fetching library entry - ${err}`)
    }
  }

  async updateLibraryEntry (mediaEntry, entryId) {
    try {
      await Kitsu.update('libraryEntry', {
        id: entryId,
        media: { type: this.type, id: mediaEntry.id },
        user: { id: userId },
        status: 'planned',
        progress: 0,
        ratingTwenty: 'null'
      })

      this.log(mediaEntry.id, 'Updated', lastAction, 'trace')
    } catch (err) {
      this.log(mediaEntry.id, 'Failed', lastAction, 'error', `Error updating library entry - ${err}`)
    }
  }
}
