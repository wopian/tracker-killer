import { exec } from 'child_process'
import input from 'inquirer'
import Listr from 'listr'
import anidb from './api/anidb'
import animeplanet from './api/animeplanet'
import anilist from './api/anilist'
import annict from './api/annict'
import kitsu from './api/kitsu'
import myanimelist from './api/myanimelist'
import { version } from '../package'
import { log } from './util'

let TASKS = []

exec(`git log -1 --format="Tracker Killer ${version}%nUpdated %ar (%h by %an)`, (err, response) => {
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
            // kitsu(service, type)
            TASKS.push({
              title: `Kitsu ${type}`,
              task: () => {
                return new Observable(observer => {
                  let datasource = new DataSource()
                  datasource.ondata = (e) => observer.next(e)
                  datasource.onerror = (err) => observer.error(err)
                  datasource.oncomplete = () => observer.complete()
                })
              }
            })
          })
          break
        case ('MyAnimeList'):
          answer.type.forEach(type => {
            // myanimelist(service, type)
            TASKS.push({
              title: `MyAnimeList ${type}`,
              task: () => {
                return new Observable(observer => {
                  myanimelist(service, type, observer)
                  // let datasource = new DataSource()
                  // datasource.ondata = (e) => observer.next(e)
                  // datasource.onerror = (err) => observer.error(err)
                  // datasource.oncomplete = () => observer.complete()
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

class DataSource {
  constructor () {
    let i = 0
    this._id = setInterval(() => this.emit(i++), 200)
  }

  emit (n) {
    const limit = 20
    if (this.ondata) this.ondata(`Requesting ${n}`)
    if (n === limit) {
      if (this.oncomplete) this.oncomplete()
      this.destroy()
    }
  }

  destroy () {
    clearInterval(this._id)
  }
}
