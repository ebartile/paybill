<p align="center">
  <a href="https://paybill.dev" target="blank"><img src="https://paybill.dev/logo-wordmark--light.png" width="180" alt="Paybill Logo" /></a>
</p>

<p align="center">
  Paybill is an open-source Saleforce Alternative for developing cloud-native enterprise applications, utilizing prebuilt standardized architectures for deployment on private and public clouds.
</p>

# @paybilldev/tsconfig

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]
[![Node.js Version](https://img.shields.io/node/v/@paybilldev/tsconfig.svg?style=flat)](https://nodejs.org/en/download/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://makeapullrequest.com)
![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/paybilldev/paybill)

[npm-image]: https://img.shields.io/npm/v/@paybilldev/tsconfig.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@paybilldev/tsconfig
[download-image]: https://img.shields.io/npm/dm/@paybilldev/tsconfig.svg?style=flat-square
[download-url]: https://npmjs.org/package/@paybilldev/tsconfig

Base tsconfig file for paybill project

## Install

```shell
npm i --save-dev @paybilldev/tsconfig
```

## Usage

```json
// tsconfig.json
{
  "extends": "@paybilldev/tsconfig",
  // custom config
  "compilerOptions": {
    // override @paybilldev/tsconfig options here
  }
}
```

## License

[AGPL](LICENSE)
