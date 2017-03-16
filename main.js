import input from 'inquirer'
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
        return 'Select at least one service'
      }
      return true
    }
  },
  {
    type: 'checkbox',
    name: 'type',
    message: 'Library type to use:',
    choices: [
      'Anime',
      'Manga'
    ],
    validate: answer => {
      if (answer.length < 1) {
        return 'Select at least one media type'
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
        console.log(answer.type)
        answer.type.forEach(type => {
          myanimelist(service, type)
        })
        break
    }
  })
})
