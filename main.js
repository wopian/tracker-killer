import input from 'inquirer'
import { log } from './util'
import anidb from './api/anidb'
import animeplanet from './api/animeplanet'
import anilist from './api/anilist'
import annict from './api/annict'
import kitsu from './api/kitsu'
import myanimelist from './api/myanimelist'

input.prompt([
  {
    type: 'checkbox',
    name: 'service',
    message: 'Select service to test:',
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
      {
        name: 'Kitsu',
        disabled: 'not implemented'
      },
      'MyAnimeList'
    ],
    validate: answer => {
      if (answer.length < 1) {
        return 'Select at least one service'
      }
      return true
    }
  },
  {
    type: 'list',
    name: 'type',
    message: 'Library type to use:',
    choices: [
      'Anime',
      'Manga'
    ]
  }
])
.then(answer => {
  answer.service.forEach(service => {
    switch (service) {
      case ('AniDB'):
        anidb(service, answer.type)
        break
      case ('AniList'):
        anilist(service, answer.type)
        break
      case ('AnimePlanet'):
        animeplanet(service, answer.type)
        break
      case ('Annict'):
        annict(service, answer.type)
        break
      case ('Kitsu'):
        kitsu(service, answer.type)
        break
      case ('MyAnimeList'):
        myanimelist(service, answer.type)
        break
    }
  })
})
