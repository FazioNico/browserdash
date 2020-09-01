# BrowserDash

> Browers Extention to enable Custom Tab Dashbord features.

## Features

* Meteo API
* Hello World
* Google Search
* Current Time

## Installation

* Visit Chrome Store Page: *soon available*

## Developpement
* clone repository
* create `./src/global/app.env.ts`file with the following content:
```
export const firebaseConfig = Object.freeze({
  apiKey: "<API_KEY>",
  authDomain: "<AUTH_DOMAIN>",
  databaseURL: "<BASE_URL>",
  projectId: "<POROJECT_ID>",
  storageBucket: "<BUCKET>",
  messagingSenderId: "<MESSAGING>",
  appId: "<APP_ID>"
});
export const owmApiKey = '<OPEN_WEATER_MAP_API_KEY>';
export const unsplashApiKey = '<UNSPASH_API_KEY>';
```
* edit `oauth.client_id`, `oauth.key`, `.src/manifest.json` with your own value
* serve application with `npm run dev`

## Build
* use your owm correct config (see Developpement)
* build application with `npm run build`
* open `www` from Google Chrome Extention Settings Panel
