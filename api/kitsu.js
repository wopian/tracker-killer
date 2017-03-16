import JsonAPi from 'devour-client'
import OAuth2 from 'client-oauth2'
import { KITSU } from '../env'
import { top } from '../util'
import { version } from '../package'

const baseUrl = 'https://kitsu.io/api'

export default async function kitsu (service, type) {
  top(service, type, KITSU.username)

  const auth = new OAuth2({
    clientId: KITSU.clientId,
    clientSecret: KITSU.clientSecret,
    accessTokenUri: baseUrl + '/oauth/token'
  })

  const Kitsu = new JsonAPi({
    apiUrl: `${baseUrl}/edge`,
    logger: false
  })

  Kitsu.headers['User-Agent'] = `tracker-killer/${version}`

  const { accessToken } = await auth.owner.getToken(KITSU.username, KITSU.password)
  const headers = {
    'Accept': 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
    'Authorization': 'Bearer ' + accessToken
  }
}
