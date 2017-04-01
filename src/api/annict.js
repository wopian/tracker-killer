import OAuth2 from 'client-oauth2'
import axios from 'axios'
import { ANNICT } from '../../env'
import { top } from '../util'
import { version } from '../../package'

const baseUrl = 'https://api.annict.com/'

export default async function annict (service, type) {
  top(service, type, ANNICT.username)

  const Annict = axios.create({
    baseURL: baseUrl,
    headers: {
      'User-Agent': `tracker-killer/${version}`
    }
  })

  Annict.get(`oauth/authorize?client_id=${ANNICT.clientId}&response_type=code}&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob&scope=read+write`)
  .then(res => {
    Annict.post(`oauth/token`, {
      data: {
        client_id: ANNICT.clientId,
        client_secret: ANNICT.clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: 'urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob',
        code: 'code'
      }
    })
    console.log(res)
  })

  /*
  Annict.post('v1/me/statuses?work_id=1&kind=wanna_watch')
  .then(res => console.log(res))
  .catch(err => console.log(err))
  */
}
