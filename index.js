import input from 'inquirer'
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
    log(JSON.stringify(answers, null, '  '))
})

// myanimelist()