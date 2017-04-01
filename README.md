# Tracker Killer

[![Github Rl]][1]
[![Travis]][2]
[![AppVeyor]][3]
[![CC Coverage]][4]
[![CC Score]][5]
[![CC Issues]][6]
[![David]][7]

This was built for experimentation purposes with the goal of inspecting how anime tracking sites deal
with users with ludicrously large libraries.

It is beneficial for testing how well these sites cope with the following:

- Initial library page load time
- Library API request serialisation time
- Library API request download size

## Results

### Anime

<table>
  <tr>
    <th rowspan="2">Service</th>
    <th rowspan="2">Library Size</th>
    <th rowspan="2">Anime Loaded</th>
    <th rowspan="2">Page Load Time (seconds)</th>
    <th colspan="4">Network (seconds)</th>
    <th colspan="3">API</th>
  </tr>
  <tr>
    <td>Loading</td>
    <td>Render</td>
    <td>Script</td>
    <td>Paint</td>
    <td>Response Time (seconds)</td>
    <td>Size (MB)</td>
    <td>Type</td>
  </tr>
  <tr align="right">
    <td>AniDB</td>
    <td colspan="10" align="center">Not Yet Implemented</td>
  </tr>
  <tr align="right">
    <td>AniList</td>
    <td colspan="10" align="center">Not Yet Implemented</td>
  </tr>
  <tr align="right">
    <td>AnimePlanet</td>
    <td colspan="10" align="center">No API Available</td>
  </tr>
  <tr align="right">
    <td>Annict</td>
    <td colspan="10" align="center">Not Yet Implemented</td>
  </tr>
  <tr align="right">
    <td>Kitsu</td>
    <td colspan="10" align="center">Not Yet Tested</td>
  </tr>
  <tr align="right">
    <td>MyAnimeList (Classic)</td>
    <td rowspan="2">12603</td>
    <td>12603</td>
    <td>42.8</td>
    <td>2.3</td>
    <td>22.8</td>
    <td>11.2</td>
    <td>0.7</td>
    <td rowspan="2">5.2</td>
    <td rowspan="2">10.1</td>
    <td rowspan="2">XML</td>
  </tr>
  <tr align="right">
    <td>MyAnimeList (Modern)</td>
    <td>300</td>
    <td colspan="5" align="center">Not Yet Tested</td>
  </tr>
</table>

### Manga

<table>
  <tr>
    <th rowspan="2">Service</th>
    <th rowspan="2">Library Size</th>
    <th rowspan="2">Manga Loaded</th>
    <th rowspan="2">Page Load Time (seconds)</th>
    <th colspan="4">Network (seconds)</th>
    <th colspan="3">API</th>
  </tr>
  <tr>
    <td>Loading</td>
    <td>Render</td>
    <td>Script</td>
    <td>Paint</td>
    <td>Response Time (seconds)</td>
    <td>Size (MB)</td>
    <td>Type</td>
  </tr>
  <tr align="right">
    <td>AniDB</td>
    <td colspan="10" align="center">Not Yet Implemented</td>
  </tr>
  <tr align="right">
    <td>AniList</td>
    <td colspan="10" align="center">Not Yet Implemented</td>
  </tr>
  <tr align="right">
    <td>AnimePlanet</td>
    <td colspan="10" align="center">No API Available</td>
  </tr>
  <tr align="right">
    <td>Annict</td>
    <td colspan="10" align="center">Not Yet Implemented</td>
  </tr>
  <tr align="right">
    <td>Kitsu</td>
    <td colspan="10" align="center">Not Yet Tested</td>
  </tr>
  <tr align="right">
    <td>MyAnimeList (Classic)</td>
    <td rowspan="2">42579</td>
    <td colspan="6" align="center">Library page 500s</td>
    <td rowspan="2" colspan="2" align="center">API 500s</td>
    <td rowspan="2">XML</td>
  </tr>
  <tr align="right">
    <td>MyAnimeList (Modern)*</td>
    <td>300</td>
    <td colspan="5" align="center">Not Yet Tested</td>
  </tr>
</table>

\* Page becomes unresponsive after loading up to 20700 manga, consuming ~20% CPU and ~4 GB of RAM on Chrome and Edge

## Usage

**<p align="center">⚠️️ This will completely overwrite all library data on these services without warning ⚠️️</p>**

### Requirements

- [git](https://git-scm.com/) 2.0.0 or newer
- [node.js](https://nodejs.org) 7.0.0 or newer
- [yarn](https://https://yarnpkg.com) 0.21.0 or newer (optional)

### Setup

1. Download source code:

    ```bash
    git clone https://github.com/wopian/tracker-killer.git
    cd tracker-killer
    ```

1. Install dependencies:

    ```bash
    yarn
    # or
    npm i
    ```

1. Rename `src/env.template.js` to `src/env.js` and add the required details

1. Run the script:

    ```bash
    yarn start
    # or
    npm start
    ```

### Reporting

WIP

```bash
./node_modules/.bin/phantomas https://myanimelist.net --har=./report/myanimelist/har --film-strip --film-strip=./report/myanimelist/.filmstrip --film-strip-prefix=''
```

## Releases

See [CHANGELOG][8]

## License

All code released under the [MIT license][9]

[GitHub Rl]:https://img.shields.io/github/release/wopian/tracker-killer.svg?style=flat-square
[Travis]:https://img.shields.io/travis/wopian/tracker-killer/master.svg?style=flat-square&label=linux%20%26%20macOS
[CC Coverage]:https://img.shields.io/codeclimate/coverage/github/wopian/tracker-killer.svg?style=flat-square
[CC Score]:https://img.shields.io/codeclimate/github/wopian/tracker-killer.svg?style=flat-square
[CC Issues]:https://img.shields.io/codeclimate/issues/github/wopian/tracker-killer.svg?style=flat-square
[David]:https://img.shields.io/david/wopian/tracker-killer.svg?style=flat-square
[AppVeyor]:https://img.shields.io/appveyor/ci/wopian/tracker-killer/master.svg?style=flat-square&label=windows

[1]:https://github.com/wopian/tracker-killer/releases
[2]:https://travis-ci.org/wopian/tracker-killer
[3]:https://ci.appveyor.com/project/wopian/tracker-killer
[4]:https://codeclimate.com/github/wopian/tracker-killer/coverage
[5]:https://codeclimate.com/github/wopian/tracker-killer
[6]:https://codeclimate.com/github/wopian/tracker-killer/issues
[7]:https://david-dm.org/wopian/tracker-killer
[8]:https://github.com/wopian/tracker-killer/blob/master/CHANGELOG.md
[9]:https://github.com/wopian/tracker-killer/blob/master/LICENSE.md
