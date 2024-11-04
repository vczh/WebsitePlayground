# WebsitePlayground

Play with nodejs

## Building

- Download [npm with nodejs](https://nodejs.org/en/download/package-manager)
- Download [yarn](https://classic.yarnpkg.com/lang/en/docs/install)
  - TL;DR: `npm install --global yarn`
- I don't know why Powershell cannot find `npm` and `yarn`.

## TypeScript

The project uses typescript with esmodule, which requires:
- `"type": "module"` in package.json
- `"module": "es6"` and optionally `"esModuleInterop": true` in tsconfig.json

When node or webpack with esmodule, TypeScript's import statement needs to be altered as follows:
- `import a from './a` -> `import a from './a.js`
- `import b from './bs` -> `import a from './bs/index.js`

When `a.js` is specified, TypeScript knows it is `a.ts`, but it still emits `a.js` in generated JavaScript code.

## EsLint

The project uses eslint to perform additional checking,
the common configuration is in `packages/eslint-shared`,
each package introduces configuration from this package with their own additional things.

## Jest and Webpack

The project uses jest and webpack for testing and deployment.
Configurations are carefully adjusted so that they could work with esmodule.

## starter-packages folder

- Copy any package  to `package` folder to create a new package.
- Change folder name and `name` in `package.json`.
- `yarn build` to build every packages.
- `yarn test` to run unit test in `starter-jest`.
- `yarn deploy` to deploy `starter-lit-html`.

Run the following packages in order for demo:

### starter-jest

A TypeScript package with unit test in **jest**.

`npm run build` and `npm run test`

### starter-http-server

An http server.
`npm run build` and `npm run start` and browse `http://localhost:8080/`.

### starter-lit-html

An HTML page using `lit-html` as a browser side template.

`npm run build` and `npm run deploy`, you are able to use IIS to run `starter-packages/starter-lit-html/lib/dist`.

### starter-website-scraper

Download a website to a local folder.

`npm run build` and `npm run start` to download `http://localhost:8080/` to `starter-packages/starter-website-scraper/lib/dist`.

It will be easier to do when IIS is hosting `starter-lit-html`.
At the end of the execution you are able to compare two different `dist` folders by yourself.
