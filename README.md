# OurPraise

This project contains the source code for OurPraise, a web-based song database made for churches to plan worship during sunday services.

# Getting started on local development

After cloning, you need to install dependencies for both the app and cloud functions. To do this, simply run `npm run first-install`.

After this, you can download a copy of the production Firestore, using the appropiate script (bash or cmd) inside the _scripts/_ directory. These scripts depend on `gcloud`, which needs to be installed and authorized. See install instructions [here](https://cloud.google.com/sdk/docs/install).

Also make sure you have `firebase-tools` installed globally and authorized. See install instructions [here](https://www.npmjs.com/package/firebase-tools).

When all is set up, you may run the following commands to start the dev server, type checking and Firebase emulators simultanously:

- `npm run dev-server`
- `npm run emulators`
- `npm run watch-types`

## Setting up a development environment

In this project you must use Prettier to format your files when saving or at least before committing. If you use VSCode, you should use the [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

Additionally you should use [ESlint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) as your linter, since there is a config file included in this project.

## Getting to know the code base

The app is built with Typescript and React. You must abide to a certain structure when contributing to the source code. Inside the _src/_ directory you will find the following files and top-level directories:

- _assets_: Contains fonts and svg files
- _backend_: Contains helper functions for most database interactions
- _blocks_: Contains styled components (No JSX!)
- _components_: Contains React components that consume styled components (No styled components declared here!)
- _hooks_: Contains hooks for backend interactions and component states
- _lib_: Contains wrappers for third party libraries such as Firebase and Algolia. Makes maintanance easier and decreases coupling to these libraries
- _mappers_: Contains mappers use when fetching or pushing data to the backend
- _pages_: Contains top-level components each representing a route. Same rules as components
- _state_: Contains Redux global store and actions
- _styles_: Contains global styles and style mixins
- _types_: Contains type declarations for globally used types and interfaces
- _utils_: Contains a few handy utility functions
- _index.tsx_: Entry point for the app. Contains state providers and the router

## Deploying a new version

To deploy a new version of the code base, simply run `npm run deploy`. This will run unit tests, build the front end and deploy to Firebase.

# API

To integrate with OurPraise, you need to use the public API. The API is available at `https://europe-west1-ourpraise-fb.cloudfunctions.net/api/ENDPOINT`. Each endpoint is documented briefly below.

## `/song`

Get single song information for presentation:

`https://europe-west1-ourpraise-fb.cloudfunctions.net/api/song?id=SONG_ID`

Song ID query parameter is required

_Example response:_

```json
{
  "id": "SONG_ID",
  "title": "Good Good Father",
  "authors": "Pat Barrett and Anthony Brown",
  "slides": [
    "I've heard a thousand stories \nof what they think You're like,\nbut I've heard the tender whisper\nof love in the dead of night\nYou tell me that You're pleased \nand that I'm never alone ",
    "You're a good good Father, \nit's who You are,\nit's who You are,\nit's who You are",
    "and I'm loved by You,\nit's who I am, \nit's who I am,\nit's who I am ",
    "..."
  ]
}
```

## `/event`

Get specific event with song information for presention:

`https://europe-west1-ourpraise-fb.cloudfunctions.net/api/event?id=EVENT_ID`

Event ID query parameter is required

_Example response:_

```json
[
  {
    "id": "EVENT_ID",
    "title": "Gudstjeneste",
    "songs": [
      {
        "id": "SONG_ID",
        "title": "Good Good Father",
        "authors": "Pat Barrett and Anthony Brown",
        "slides": [
          "I've heard a thousand stories \nof what they think You're like,\nbut I've heard the tender whisper\nof love in the dead of night\nYou tell me that You're pleased \nand that I'm never alone ",
          "You're a good good Father, \nit's who You are,\nit's who You are,\nit's who You are",
          "and I'm loved by You,\nit's who I am, \nit's who I am,\nit's who I am ",
          "..."
        ]
      }
    ]
  }
]
```

## `/events`

Get all events with minimal information:

`https://europe-west1-ourpraise-fb.cloudfunctions.net/api/events`

_Example response:_

```json
[
  {
    "id": "EVENT_ID",
    "title": "Gudstjeneste",
    "date": "2022-01-01",
    "songs": 5
  }
]
```
