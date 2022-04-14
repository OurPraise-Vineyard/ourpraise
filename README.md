# Besyng

This repo contains the source code for Besyng, an online worship platform that helps band leaders and musicians share chords and set lists.

# Develop

`npm i && cd functions && npm i && cd ..`

`./mirror-firestore.sh`

`npm start`

# Integration API

Get events and songs for presentation:

`https://europe-west1-songdriver-firebase.cloudfunctions.net/slides?event=EVENT_ID&song=SONG_ID`

Provide *either* a song id or an event id. If both are present, the song id will be ignored.

Example response:

```json
[
  {
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
```
