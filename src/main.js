import input from 'inquirer'
import Listr from 'listr'
import Observable from 'zen-observable'
import { log } from './util'
import Annict from './api/annict'
import Kitsu from './api/kitsu'
import Myanimelist from './api/myanimelist'

(async () => {
  const { services, types } = await input.prompt([
    {
      type: 'checkbox',
      name: 'services',
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
      name: 'types',
      message: 'Select library types:',
      choices: [
        'Anime',
        'Manga'
      ],
      validate: answer => answer.length < 1 ? 'Pick at least one' : true
    }
  ])

  let TASKS = []

  await services.forEach(service => {
    types.forEach(type => {
      TASKS.push(observable(service, type))
    })
  })

  const tasks = new Listr(TASKS, { concurrent: true, exitOnError: false })
  await tasks.run()

  await log.info('╭' + '─'.repeat(24) + '╮')
  await log.info('│ All services finished! │')
  await log.info('╰' + '─'.repeat(24) + '╯')
  console.log('\nAll services finished\n')
  setTimeout(() => {
    process.exit(0)
  }, 100)
})()

function observable (service, type) {
  return {
    title: `${service} ${type}`,
    task: () => {
      return new Observable(observer => {
        const api = call(service, type)
        api.ondata = event => observer.next(event)
        api.onerror = err => observer.error(err)
        api.oncomplete = event => observer.complete(event)
      })
    }
  }
}

function call (service, type) {
  switch (service) {
    case 'AniDB':
      break
    case 'AniList':
      break
    case 'AnimePlanet':
      break
    case 'Annict':
      return new Annict(type)
    case 'Kitsu':
      return new Kitsu(type)
    case 'MyAnimeList':
      return new Myanimelist(type)
  }
}
