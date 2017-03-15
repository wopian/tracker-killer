# Tracker Killer

This was built for experimentation purposes with the goal of inspecting how anime tracking sites deal 
with users with ludicrously large libraries.

It is beneficial for testing how well these sites cope with the following:
- Initial library page load time
- Library API request serialisation time
- Library API request download size

## Results

| Test                      | AniList   | Kitsu | MyAnimeList
| ------------------------- | --------: | ----: | ----------:
| Page load time (initial)  | N/A       | N/A   | N/A
| Page load time (refresh)  | N/A       | N/A   | N/A
| Render time               | N/A       | N/A   | N/A
| Paint time (onload)       | N/A       | N/A   | N/A
| Paint time (loaded)       | N/A       | N/A   | N/A
| Paint time (scroll)       | N/A       | N/A   | N/A
| API response time         | N/A       | N/A   | N/A
| API download size         | N/A       | N/A   | N/A

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

3. Add this repository as origin:

    ```bash
    git remote add origin https://github.com/wopian/hibari.git
    ```

4. Create a file named `env.js` where `index.js` is. Copy and paste
the following code inside it:

    ```javascript
    module.exports = {
        ANILIST: {
            username: 'yourusername',
            client_id: 'yourclientid',
            client_secret: 'yourclientsecret'
        },
        KITSU: {},
        MYANIMELIST: {
            username: 'yourusername',
            password: 'yourpassword'
        }
    }
    ```

## Testing MyAnimeList
### Output
```bash
00000               # MAL media ID
00000   request     # sent request to add media to library
00000    added      # media added to library  - marked as Completed and rated 10/10
00000   updated     # media exists in library -  "                               "
00000   failure     # deleted on MAL or is already in Completed and rated 10/10
```
