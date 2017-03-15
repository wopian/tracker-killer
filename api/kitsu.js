import { KITSU } from '../env'
import { log, top } from '../util'
import chalk from 'chalk'
import axios from 'axios'
import OAuth2 from 'client-oauth2'

const baseUrl = 'https://kitsu.io/api'

export default async function kitsu (service, type) {
  top(service, type, KITSU.username)

  const oauth = new OAuth2({
    clientId: KITSU.client_id,
    clientSecret: KITSU.client_secret,
    accessTokenUri: baseUrl + '/oauth/token'
  })

  const { accessToken } = await oauth.owner.getToken(KITSU.username, KITSU.password)
  const headers = {
    'Accept': 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
    'Authorization': 'Bearer ' + accessToken
  }
}
