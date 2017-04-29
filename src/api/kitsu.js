import OAuth2 from 'client-oauth2'
import JsonApi from 'devour-client'
import { KITSU } from '../../env'
import { version } from '../../package'
import { pad, padID, log } from '../util'

const baseUrl = 'https://kitsu.io/api'
let Kitsu, auth, userId
let ERRORS = []

export default class Api {
  constructor (type) {
    this.type = type.toLowerCase()
    this.main()
  }

  async main () {
    auth = await new OAuth2({
      clientId: KITSU.CLIENT_ID,
      clientSecret: KITSU.CLIENT_SECRET,
      accessTokenUri: `${baseUrl}/oauth/token`
    })
    Kitsu = await new JsonApi({
      apiUrl: `${baseUrl}/edge`,
      logger: false
    })
    Kitsu.headers['User-Agent'] = `trackerKiller/${version} (wopian)`
    let { accessToken } = await auth.owner.getToken(KITSU.USERNAME, KITSU.PASSWORD)
    Kitsu.headers['Authorization'] = await `Bearer ${accessToken}`
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
    await this.getUser()
    await this.getMedia(0)
  }

  // Get user ID
  async getUser () {
    try {
      let response = await Kitsu.findAll('user', {
        fields: { users: 'id' },
        filter: { name: KITSU.USERNAME },
        page: { limit: 1 }
      })
      userId = await response[0].id
      log.info(`${pad('Kitsu')} (${this.type}) Connected to ${KITSU.USERNAME} (${userId})`)
      this.ondata(`Got user ID of ${KITSU.USERNAME} (${userId})`)
    } catch (err) {
      log.error(`${pad('Kitsu')} (${this.type}) Getting ID of ${KITSU.USERNAME} failed - ${err}`)
      this.ondata(`Get user (Failed 1)`)
      ERRORS.push([-1, err])
    }
  }

  async getMedia (offset) {
    let response
    try {
      response = await Kitsu.findAll(this.type, {
        fields: { anime: 'id', manga: 'id' },
        page: { limit: 20, offset }
      })
      log.trace(`${pad('Kitsu')} (${this.type}) ${padID(offset)}-${offset + 20} Fetched`)
      this.ondata(`${offset}-${offset + 20} (Fetched)`)
      await this.addLibraryEntry(response)
    } catch (err) {
      log.error(`${pad('Kitsu')} (${this.type}) ${padID(offset)}-${offset + 20} Fetch failed`)
      this.ondata(`Get ${offset}-${offset + 20} (Failed 1)`)
      ERRORS.push([0, err])
    } finally {
      // Load next page if it exists
      if (response.links.next) await this.getMedia(offset + 20)
      else if (this.oncomplete) {
        // Dump errors
        log.info(`${pad('Kitsu')} (${this.type}) Finished with ${ERRORS.length} errors`)
        if (ERRORS.length) log.error(ERRORS)
        this.oncomplete()
      }
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
        log.trace(`${pad('Kitsu')} (${this.type}) ${padID(mediaEntry.id)} Added`)
        this.ondata(`${mediaEntry.id} (Added)`)
      } catch (err) {
        // User already has media in their library
        if (await err.animeId === 'has already been taken' || await err.mangaId === 'has already been taken') {
          log.trace(`${pad('Kitsu')} (${this.type}) ${padID(mediaEntry.id)} Add failed - media already in library`)
          await this.getLibraryEntry(mediaEntry)
        } else {
          log.error(`${pad('Kitsu')} (${this.type}) ${padID(mediaEntry.id)} Update failed - ${err}`)
          this.ondata(`${mediaEntry.id} (Failed 1)`)
          ERRORS.push([mediaEntry.id, err])
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
      log.trace(`${pad('Kitsu')} (${this.type}) ${padID(mediaEntry.id)} Fetched library entry`)
      await this.updateLibraryEntry(mediaEntry, response[0].id)
    } catch (err) {
      log.error(`${pad('Kitsu')} (${this.type}) ${padID(mediaEntry.id)} Fetch library entry failed - ${err}`)
      this.ondata(`${mediaEntry.id} (Failed 2)`)
      ERRORS.push([mediaEntry.id, err])
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
      log.trace(`${pad('Kitsu')} (${this.type}) ${padID(mediaEntry.id)} Updated`)
      this.ondata(`${mediaEntry.id} (Updated)`)
    } catch (err) {
      log.error(`${pad('Kitsu')} (${this.type}) ${padID(mediaEntry.id)} Update failed - ${err}`)
      this.ondata(`${mediaEntry.id} (Failed 3)`)
      ERRORS.push([mediaEntry.id, err])
    }
  }
}
