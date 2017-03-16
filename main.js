import { exec } from 'child_process'
import input from 'inquirer'
import anidb from './api/anidb'
import animeplanet from './api/animeplanet'
import anilist from './api/anilist'
import annict from './api/annict'
import kitsu from './api/kitsu'
import myanimelist from './api/myanimelist'
import { version } from './package'
import { log } from './util'

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
        'AniList',
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
    console.log(answer)
    answer.service.forEach(service => {
      switch (service) {
        case ('AniDB'):
          answer.type.forEach(type => {
            anidb(service, type)
          })
          break
        case ('AniList'):
          answer.type.forEach(type => {
            anilist(service, type)
          })
          break
        case ('AnimePlanet'):
          answer.type.forEach(type => {
            animeplanet(service, type)
          })
          break
        case ('Annict'):
          answer.type.forEach(type => {
            annict(service, type)
          })
          break
        case ('Kitsu'):
          answer.type.forEach(type => {
            kitsu(service, type)
          })
          break
        case ('MyAnimeList'):
          answer.type.forEach(type => {
            myanimelist(service, type)
          })
          break
      }
    })
  })
}
