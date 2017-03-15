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
        ]
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
    switch (answer.service) {
        case ('AniDB'):
            anidb(answer.type)
            break
        case ('AniList'):
            anilist(answer.type)
            break
        case ('AnimePlanet'):
            animeplanet(answer.type)
            break
        case ('Annict'):
            annict(answer.type)
            break
        case ('Kitsu'):
            kitsu(answer.type)
            break
        case ('MyAnimeList'):
            myanimelist(answer.type)
            break
    }
})
