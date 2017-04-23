import { exec } from 'child_process'
import input from 'inquirer'
import Listr from 'listr'
import Anidb from './api/anidb'
import Animeplanet from './api/animeplanet'
import Anilist from './api/anilist'
import Annict from './api/annict'
import Kitsu from './api/kitsu'
import Myanimelist from './api/myanimelist'
import { version } from '../package'
import { log } from './util'

let TASKS = []

exec(`git log -1 --format="Tracker Killer ${version}%nUpdated %ar (%h)`, (err, response) => {
  log(response)
  if (err) log(err)
  prompt()
})

function prompt () {
  input.prompt([
    {
      type: 'checkbox',
      name: 'service',
      message: 'Select services:',
      choices: [
        {
          name: 'AniDB',
          disabled: 'not implemented'
        },
        {
          name: 'AniList',
          disabled: 'not implemented'
        },
        {
          name: 'AnimePlanet',
          disabled: 'no api'
        },
        {
          name: 'Annict',
          disabled: 'not implemented'
        },
        'Kitsu',
        'MyAnimeList'
      ],
      validate: answer => {
        if (answer.length < 1) {
          return 'Pick at least one'
        }
        return true
      }
    },
    {
      type: 'checkbox',
      name: 'type',
      message: 'Select library types:',
      choices: [
        'Anime',
        'Manga'
      ],
      validate: answer => {
        if (answer.length < 1) {
          return 'Pick at least one'
        }
        return true
      }
    }
  ])
  .then(answer => {
    answer.service.forEach(service => {
      switch (service) {
        case ('AniDB'):
          answer.type.forEach(type => {
            // anidb(service, type)
          })
          break
        case ('AniList'):
          answer.type.forEach(type => {
            // anilist(service, type)
          })
          break
        case ('AnimePlanet'):
          answer.type.forEach(type => {
            // animeplanet(service, type)
          })
          break
        case ('Annict'):
          answer.type.forEach(type => {
            // annict(service, type)
          })
          break
        case ('Kitsu'):
          answer.type.forEach(type => {
            TASKS.push({
              title: `${service} ${type}`,
              task: () => {
                return new Observable(observer => {
                  let api = new Kitsu(type)
                  api.ondata = (e) => observer.next(e)
                  api.onerror = (err) => observer.error(err)
                  api.oncomplete = () => observer.complete()
                })
              }
            })
          })
          break
        case ('MyAnimeList'):
          answer.type.forEach(type => {
            TASKS.push({
              title: `${service} ${type}`,
              task: () => {
                return new Observable(observer => {
                  let api = new Myanimelist(type)
                  api.ondata = (e) => observer.next(e)
                  api.onerror = (err) => observer.error(err)
                  api.oncomplete = () => observer.complete()
                })
              }
            })
          })
          break
      }
    })
  })
  .then(() => {
    const tasks = new Listr(TASKS, { concurrent: true })
    tasks.run()
  })
}
