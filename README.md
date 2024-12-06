# OurPraise

This project contains the source code for OurPraise, a web-based song database made for churches to plan worship during sunday services.

## Prerequites

- [Node.js 20](https://nodejs.org/en)
- [Pnpm](https://pnpm.io/)
- [Firebase CLI](https://firebase.google.com/docs/cli)
- [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESlint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- Setup emulators as described [here](https://github.com/gustavgb/ourpraise-firebase)
- Access to ourpraise firebase instance

## Installation

```
pnpm install
```

## Development

- `pnpm dev`
- `pnpm check`
- `pnpm build`
- `pnpm run deploy`

## Emulators and API Documentation

To develop locally use the emulator suite as described [here](https://github.com/gustavgb/ourpraise-firebase). There you will also find the API documentation.

## Setting up a development environment

In this project you must use Prettier to format your files when saving or at least before committing. If you use VSCode, you should use the [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

Additionally you should use [ESlint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) as your linter, since there is a config file included in this project.

## Getting to know the code base

This project uses and depends on:

- Vite
- React
- Tailwind
- Firebase
- Tanstack Router
- Typescript
