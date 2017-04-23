import OAuth2 from 'client-oauth2'
import JsonApi from 'devour-client'
import { KITSU } from '../../env'
import { version } from '../../package'

export default class Api {
  constructor (type) {
    this.type = type.toLowerCase()
    this.main()
  }

  async main () {
    const baseUrl = 'https://kitsu.io/api'
    const auth = await new OAuth2({
      clientId: KITSU.CLIENT_ID,
      clientSecret: KITSU.CLIENT_SECRET,
      accessTokenUri: `${baseUrl}/oauth/token`
    })
    const Kitsu = await new JsonApi({
      apiUrl: `${baseUrl}/edge`,
      logger: false
    })

    Kitsu.headers['User-Agent'] = `trackerKiller/${version} (wopian)`

    let { accessToken } = await auth.owner.getToken(KITSU.USERNAME, KITSU.PASSWORD)
    let userId

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

    // Get user ID
    await Kitsu.findAll('user', {
      fields: { users: 'id' },
      filter: { name: KITSU.USERNAME },
      page: { limit: 1 }
    })
    .then(response => {
      userId = response[0].id
      this.ondata(`Got user ID of ${KITSU.USERNAME} (${userId})`)
    })
    .catch(err => this.onerror(err))

    const getMedia = async offset => {
      const response = await Kitsu.findAll(this.type, {
        fields: { anime: 'id', manga: 'id' },
        page: { limit: 20, offset }
      })
      .catch(err => this.onerror(err))

      for (let mediaEntry of await response) {
        await Kitsu.create('libraryEntry', {
          media: {
            type: this.type,
            id: mediaEntry.id
          },
          user: { id: userId },
          status: 'planned',
          progress: 0,
          ratingTwenty: null
        })
        .then(() => this.ondata(`${mediaEntry.id} (Added)`))
        .catch(async err => {
          // User already has media in their library
          if (err.animeId === 'has already been taken' ||
              err.mangaId === 'has already been taken') {
            // Get the library entry to find its ID
            await Kitsu.findAll('libraryEntry', {
              filter: {
                userId,
                kind: this.type,
                mediaId: mediaEntry.id
              },
              page: { limit: 1 }
            })
            .then(async response => {
              await Kitsu.update('libraryEntry', {
                id: response[0].id,
                media: {
                  type: this.type,
                  id: mediaEntry.id
                },
                user: { id: userId },
                status: 'planned',
                progress: 0,
                ratingTwenty: null
              })
              .then(() => this.ondata(`${mediaEntry.id} (Updated)`))
              .catch(err => this.onerror(err))
            })
            .catch(err => this.onerror(err))
          } else this.onerror(err)
        })
      }

      // Load next page if it exists
      if (await response.links.next) await getMedia(offset += 20)
      else if (this.oncomplete) await this.oncomplete()
    }

    await getMedia(0)
  }
}
