import input from 'inquirer'
import anidb from './api/anidb'
import animeplanet from './api/animeplanet'
import anilist from './api/anilist'
import annict from './api/annict'
import kitsu from './api/kitsu'
import myanimelist from './api/myanimelist'

const log = console.log

input.prompt([
    {
        type: 'list',
        name: 'service',
        message: 'Select service to test:',
        choices: [
            'AniDB',
            'AniList',
            'AnimePlanet',
            'Annict',
            'Kitsu',
            'MyAnimeList'
        ]
    }
])
.then(answers => {
    switch (answers.service) {
        case ('AniDB'):
            anidb()
            break
        case ('AniList'):
            anilist()
            break
        case ('AnimePlanet'):
            animeplanet()
            break
        case ('Annict'):
            annict()
            break
        case ('Kitsu'):
            kitsu()
            break
        case ('MyAnimeList'):
            myanimelist()
            break
    }
})

// myanimelist()