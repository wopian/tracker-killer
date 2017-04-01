import OAuth2 from 'client-oauth2'
import JsonAPi from 'devour-client'
import { KITSU } from '../env'
import { top } from '../util'
import { version } from '../package'

export default async function kitsu (service, media) {
  top(service, media, KITSU.USERNAME)
  const baseUrl = 'https://kitsu.io/api'
  const auth = await new OAuth2({
    clientId: KITSU.CLIENT_ID,
    clientSecret: KITSU.CLIENT_SECRET,
    accessTokenUri: `${baseUrl}/oauth/token`
  })
  const Kitsu = await new JsonAPi({
    apiUrl: `${baseUrl}/edge`,
    logger: false
  })
  let userId
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
  let { accessToken } = await auth.owner.getToken(KITSU.USERNAME, KITSU.PASSWORD)
  Kitsu.headers['Authorization'] = await `Bearer ${accessToken}`
  // Get user ID
  await Kitsu.findAll('user', {
    fields: { users: 'id' },
    filter: { name: KITSU.USERNAME },
    page: { limit: 1 }
  })
  .then(response => {
    userId = response[0].id
  })
  .catch(err => console.error(err))
  let getMedia = async offset => {
    // media is passed in as Titlecase
    let _media = media.toLowerCase()
    console.log(service, media, 'Getting', offset, 'to', offset + 20)
    // Get media on Kitsu
    let response = await Kitsu.findAll(_media, {
      fields: { anime: 'id' },
      page: { limit: 20, offset }
    })
    .catch(err => console.log(err))
    for (let mediaEntry of await response) {
      console.log(service, media, mediaEntry.id, 'Try create')
      // Try creating a library entry for each media
      await Kitsu.create('libraryEntry', {
        media: {
          type: _media,
          id: mediaEntry.id
        },
        user: { id: userId },
        status: 'planned',
        progress: 0,
        rating: null
      })
      .catch(err => {
        // User already has media in their library
        if (err.animeId === 'has already been taken' ||
            err.mangaId === 'has already been taken') {
          console.log(service, media, mediaEntry.id, 'Get entry')
          // Get the library entry to find its ID
          Kitsu.findAll('libraryEntry', {
            filter: { userId, kind: _media, mediaId: mediaEntry.id },
            page: { limit: 1 }
          })
          .then(response => {
            console.log(service, media, mediaEntry.id, 'Try update')
            // Update the library entry for uniform testing
            Kitsu.update('libraryEntry', {
              id: response[0].id,
              media: {
                type: _media,
                id: mediaEntry.id
              },
              user: { id: userId },
              status: 'planned',
              progress: '0',
              rating: null
            })
            .catch(err => console.log(err))
          })
          .catch(err => console.log(err))
        } else console.log(err)
      })
    }
    // Load next page if it exists
    if (await response.links.next) await getMedia(offset += 20)
  }

  // Start!
  await getMedia(0)
}
