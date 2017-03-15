# Tracker Killer
This was built for experimentation purposes with the goal of inspecting how anime tracking sites deal
with users with ludicrously large libraries.

It is beneficial for testing how well these sites cope with the following:
- Initial library page load time
- Library API request serialisation time
- Library API request download size

## Contents
- [Results](#results)
- [Usage](#usage)
- [Testing](#testing)
    - [MyAnimeList](#myanimelist)

## Results
### Anime
Test                        | AniDB | AniList   | AnimePlanet   | Annict    | Kitsu | MyAnimeList
--------------------------- | ----: | --------: | ------------: | --------: | ----: | ----------:
Anime count                 |       |           |               |           |       | 12608
Page load time (initial)    |       |           |               |           |       |
Page load time (refresh)    |       |           |               |           |       |
Render time                 |       |           |               |           |       |
Paint time (onload)         |       |           |               |           |       |
Paint time (loaded)         |       |           |               |           |       |
Paint time (scroll)         |       |           |               |           |       |
API response time           |       |           |               |           |       |
API download size           |       |           |               |           |       |

### Manga
Test                        | AniList   | AnimePlanet   | Annict    | Kitsu | MyAnimeList
--------------------------- | --------: | ------------: | --------: | ----: | ----------:
Manga count                 |           |               |           |       | 42579
Page load time (initial)    |           |               |           |       |
Page load time (refresh)    |           |               |           |       |
Render time                 |           |               |           |       |
Paint time (onload)         |           |               |           |       |
Paint time (loaded)         |           |               |           |       |
Paint time (scroll)         |           |               |           |       |
API response time           |           |               |           |       |
API download size           |           |               |           |       |

## Usage
**<p align="center">⚠️️ This will completely overwrite all library data on these services without warning ⚠️️</p>**

### Requirements
- [git](https://git-scm.com/) 2.0.0 or newer
- [node.js](https://nodejs.org) 7.0.0 or newer
- npm 3.10.8 or newer (installed with node.js)
  - run `npm install npm -g` to update to latest version

### Setup
1. Download source code:

    ```bash
    git clone https://github.com/wopian/tracker-killer.git
    cd tracker-killer
    ```
2. Install dependencies:

    ```bash
    npm i
    ```

3. Create a file named `env.js` where `index.js` is. Copy and paste
the following code inside it:

    ```javascript
    module.exports = {
        ANILIST: {
            username: 'yourusername',
            client_id: 'yourclientid',
            client_secret: 'yourclientsecret'
        },
        KITSU: {
            username: 'yourusername'
        },
        MYANIMELIST: {
            username: 'yourusername',
            password: 'yourpassword'
        }
    }
    ```

### Running
Enter the command below and use the arrow keys to select the service to test with.
```bash
npm start
```

## Testing
### MyAnimeList
#### Output
```bash
00000               # MAL media ID
00000   request     # sent request to add media to library
00000    added      # media added to library  - marked as Completed and rated 10/10
00000   updated     # media exists in library -  "                               "
00000   failure     # deleted on MAL or is already in Completed and rated 10/10
```
