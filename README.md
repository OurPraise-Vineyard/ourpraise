# OurPraise

This repo contains the source code for OurPraise, an online worship platform that helps band leaders and musicians share chords and set lists.

# Develop

`npm i && cd functions && npm i && cd ..`

`./mirror-firestore.sh`

`npm start`

# API

The API is available at `https://europe-west1-ourpraise-fb.cloudfunctions.net/api/ENDPOINT`.

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
    "I've seen many searching \nfor answers far and wide,\nbut I know we're all searching \nfor answers only You provide,\n'cause You know just what we need \nbefore we say a word ",
    "Love so undeniable I can hardly speak, \npeace so unexplainable I can hardly think. \nAs you call me deeper still,\nas you call me deeper still,\nas you call me deeper still,\ninto Love Love Love ",
    "You are perfect in all of Your ways\nYou are perfect in all of Your ways\nYou are perfect in all of Your ways to us  \n"
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
          "I've seen many searching \nfor answers far and wide,\nbut I know we're all searching \nfor answers only You provide,\n'cause You know just what we need \nbefore we say a word ",
          "Love so undeniable I can hardly speak, \npeace so unexplainable I can hardly think. \nAs you call me deeper still,\nas you call me deeper still,\nas you call me deeper still,\ninto Love Love Love ",
          "You are perfect in all of Your ways\nYou are perfect in all of Your ways\nYou are perfect in all of Your ways to us  \n"
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
