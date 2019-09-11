# WebsitePlayground

Play with nodejs

## Building

- Download [npm with nodejs](https://www.npmjs.com/get-npm)
- Download [yarn](https://yarnpkg.com/lang/en/)
- Run following commands in cmd
  - I don't know why Powershell cannot find `npm` and `yarn`.

```plaintext
yarn
yarn build
yarn test
yarn deploy
```

## starter-packages folder

- Copy any package  to `package` folder to create a new package
- Change folder name and `name` in `package.json`

### starter-jest

A TypeScript package with unit test in **jest**.

### starter-http-server

An http server. Use `npm run start` to host.

### starter-lit-html

An HTML page using `lit-html` as a browser side template.

After `yarn deploy`, you are able to use IIS to run `starter-packages/starter-lit-html/lib/dist`.
