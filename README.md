# Tracker Killer

[![release badge]][release]
[![travis badge]][travis]
[![david badge]][david]
[![david dev badge]][david dev]

[![cc maintainability badge]][cc maintainability]
[![cc debt badge]][cc debt]
[![cc issues badge]][cc issues]
[![cc loc badge]][cc loc]

This was built as an experiment to see how well anime/manga tracking sites deal with ludicrously
large libraries. As such, it currently allows testing the following:
- Initial library page load time,
- Library API request serialisation time,
- Library API request download size,
- And any other side effects

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
    <td colspan="10" align="center">Not Yet Tested</td>
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

\* Page becomes unresponsive after loading up to 20700 manga, consuming ~20%
CPU and ~4 GB of RAM on Chrome 56 and Edge 14

## Usage

<strong><p align="center">⚠️️ This will completely overwrite all library data on
these services without warning ⚠️️</p></strong>

### Requirements

- [git] `>= 2.0.0`
- [node] `>= 8.0.0`
- [yarn] `>= 1.0.0` (optional)

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
    npm install
    ```

1. Rename `src/env.template.js` to `src/env.js` and add the required details

1. Run the script:

    ```bash
    yarn start
    # or
    npm start
    ```

1. Debugging (`ALL`, `INFO` (default), `DEBUG`, `WARN`, `ERROR` & `TRACE`)

    ```bash
    yarn start -- DEBUG
    # or
    npm start -- DEBUG
    ```

### Reporting

WIP

```bash
./node_modules/.bin/phantomas https://myanimelist.net --har=./report/myanimelist/har --film-strip --film-strip=./report/myanimelist/.filmstrip --film-strip-prefix=''
```

## Releases

See [CHANGELOG]

## License

All code released under the [MIT license]

[git]:https://git-scm.com
[node]:https://nodejs.org
[yarn]:https://yarnpkg.com

[CHANGELOG]:CHANGELOG.md
[MIT]:LICENSE.md

[release]:https://github.com/wopian/tracker-killer/releases
[release badge]:https://flat.badgen.net/github/release/wopian/tracker-killer

[david]:https://david-dm.org/wopian/tracker-killer
[david badge]:https://flat.badgen.net/david/dep/wopian/tracker-killer

[david dev]:https://david-dm.org/wopian/tracker-killer?type=dev
[david dev badge]:https://flat.badgen.net/david/dev/wopian/tracker-killer

[travis]:https://travis-ci.org/wopian/tracker-killer
[travis badge]:https://flat.badgen.net/travis/wopian/tracker-killer

[cc maintainability]:https://codeclimate.com/github/wopian/tracker-killer
[cc maintainability badge]:https://flat.badgen.net/codeclimate/maintainability/wopian/tracker-killer

[cc debt]:https://codeclimate.com/github/wopian/tracker-killer
[cc debt badge]:https://flat.badgen.net/codeclimate/tech-debt/wopian/tracker-killer

[cc issues]:https://codeclimate.com/github/wopian/tracker-killer/issues
[cc issues badge]:https://flat.badgen.net/codeclimate/issues/wopian/tracker-killer

[cc loc]:https://codeclimate.com/github/wopian/tracker-killer
[cc loc badge]:https://flat.badgen.net/codeclimate/loc/wopian/tracker-killer
