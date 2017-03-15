import input from 'inquirer'
import anilist from './api/anilist'
import myanimelist from './api/myanimelist'

const log = console.log

input.prompt([
    {
        type: 'list',
        name: 'service',
        message: 'Select service to test:',
        choices: [
            'AniList',
            'Kitsu',
            'MyAnimeList'
        ]
    }
])
.then(answers => {
    switch (answers.service) {
        case ('AniList'):
            anilist()
            break
        case ('Kitsu'):
            log('Not implemented yet')
            break
        case ('MyAnimeList'):
            myanimelist()
            break
    }
})

// myanimelist()