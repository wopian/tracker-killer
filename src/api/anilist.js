import axios from 'axios'
import Q from 'q'
import { log, top } from '../util'
import { ANILIST } from '../../env'

export default function anilist (service, type) {
  top(service, type, ANILIST.username)

  const client_id = ANILIST.client_id
  const client_secret = ANILIST.client_secret
  const username = ANILIST.username

  let temp = Q.when({})
  const anime = Array.apply(null, {length: 35087}).map(Number.call, Number)

  function auth (client_id, client_secret) {
    return axios({
      method: 'post',
      url: 'auth/access_token',
      baseURL: 'https://anilist.co/api/',
      data: {
        grant_type: 'client_credentials',
        client_id,
        client_secret
      }
    })
    .then(res => {
      log(res.data.access_token)
      log(res.data.token_type)
      return axios.create({
        baseURL: 'https://anilist.co/api',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `${res.data.token_type} ${res.data.access_token}`
        }
      })
    })
    /*
    .then(base => {
        return base.post('animelist', {
            data: {
                id: 1,
                list_status: 'completed',
                score_raw: 100
            }
        })
    })
    */
    .catch(err => log(err.toString()))
  }
  auth(client_id, client_secret)
}
