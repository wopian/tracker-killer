import input from 'inquirer'
import Listr from 'listr'
import { log } from './util'
import Anidb from './api/anidb'
import Animeplanet from './api/animeplanet'
import Anilist from './api/anilist'
import Annict from './api/annict'
import Kitsu from './api/kitsu'
import Myanimelist from './api/myanimelist'

let TASKS = []

input.prompt([
  {
    type: 'checkbox',
    name: 'service',
    message: 'Select services:',
    choices: [
      {
        name: 'AniDB',
        disabled: 'unimplemented'
      },
      {
        name: 'AniList',
        disabled: 'wip'
      },
      {
        name: 'AnimePlanet',
        disabled: 'no api'
      },
      'Annict',
      'Kitsu',
      'MyAnimeList'
    ],
    validate: answer => answer.length < 1 ? 'Pick at least one' : true
  },
  {
    type: 'checkbox',
    name: 'type',
    message: 'Select library types:',
    choices: [
      'Anime',
      'Manga'
    ],
    validate: answer => answer.length < 1 ? 'Pick at least one' : true
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
          TASKS.push({
            title: `${service} ${type}`,
            task: () => {
              return new Observable(observer => {
                let api = new Annict(type)
                api.ondata = (e) => observer.next(e)
                api.onerror = (err) => observer.error(err)
                api.oncomplete = () => observer.complete()
              })
            }
          })
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
  const tasks = new Listr(TASKS, { concurrent: true, exitOnError: false })
  tasks.run()
  .then(async () => {
    await log.info('╭' + '─'.repeat(24) + '╮')
    await log.info('│ All services finished! │')
    await log.info('╰' + '─'.repeat(24) + '╯')
    console.log('\nAll services finished\n')
    setTimeout(() => {
      process.exit(0)
    }, 100)
  })
})
