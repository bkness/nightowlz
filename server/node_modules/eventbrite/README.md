# Eventbrite JavaScript SDK

[![version](https://img.shields.io/npm/v/eventbrite.svg)](http://npm.im/eventbrite)
[![downloads](https://img.shields.io/npm/dt/eventbrite.svg)](http://npm-stat.com/charts.html?package=eventbrite&from=2018-05-01)
[![module formats: esm, cjs, & umd](https://img.shields.io/badge/module%20formats-esm%2C%20cjs%2C%20umd-green.svg)](https://unkpg.com/eventbrite/)
![npm type definitions](https://img.shields.io/npm/types/eventbrite.svg)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![license](https://img.shields.io/github/license/eventbrite/eventbrite-sdk-javascript.svg)](LICENSE)

[![Maintenance Status](https://img.shields.io/badge/status-maintained-brightgreen.svg)](https://github.com/eventbrite/eventbrite-sdk-javascript/pulse)
[![Build Status](https://travis-ci.org/eventbrite/eventbrite-sdk-javascript.svg?branch=master)](https://travis-ci.org/eventbrite/eventbrite-sdk-javascript)
[![Dependencies status](https://img.shields.io/david/eventbrite/eventbrite-sdk-javascript.svg)](https://david-dm.org/eventbrite/eventbrite-sdk-javascript)
[![Dev Dependencies status](https://img.shields.io/david/dev/eventbrite/eventbrite-sdk-javascript.svg)](https://david-dm.org/eventbrite/eventbrite-sdk-javascript?type=dev)

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

[![Watch on GitHub](https://img.shields.io/github/watchers/eventbrite/eventbrite-sdk-javascript.svg?style=social)](https://github.com/eventbrite/eventbrite-sdk-javascript/watchers)
[![Star on GitHub](https://img.shields.io/github/stars/eventbrite/eventbrite-sdk-javascript.svg?style=social)](https://github.com/eventbrite/eventbrite-sdk-javascript/stargazers)
[![Tweet](https://img.shields.io/twitter/url/https/github.com/eventbrite/eventbrite-sdk-javascript.svg?style=social)](https://twitter.com/intent/tweet?text=Check%20out%20the%20official%20Eventbrite%20API%20JavaScript%20DSK%20by%20%40evbeng!%20%0A%20https%3A%2F%2Fgithub.com%2Feventbrite%2Feventbrite-sdk-javascript%2F)

The official JavaScript SDK for the [Eventbrite v3 API](https://www.eventbrite.com/developer/v3/).

> NOTE: This library is still in **beta** as we flesh out the API of the SDK.

## Table of Contents

*   [Installation](#installation)
*   [Quick Usage](#quick-usage)
*   [API Docs](docs/)
*   [Target Environments](#target-environments)
*   [Contributing](CONTRIBUTING.md)
*   [Project philosophy](#project-philosophy)
*   [License](LICENSE)

## Installation

Install via [Yarn](https://yarnpkg.com/lang/en/docs/managing-dependencies/):

```sh
yarn add eventbrite
```

Install via [NPM](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```sh
npm install --save eventbrite
```

## Quick Usage

```js
const eventbrite = require('eventbrite');

// Create configured Eventbrite SDK
const sdk = eventbrite({token: 'OATH_TOKEN_HERE'});

// See: https://www.eventbrite.com/developer/v3/endpoints/users/#ebapi-get-users-id
sdk.request('/users/me').then(res => {
    // handle response data
});
```

Read more on [getting a token](https://www.eventbrite.com/developer/v3/api_overview/authentication/#ebapi-getting-a-token).

## API Docs

[Eventbrite v3 API JavaScript SDK Documentation](docs/)

## Target Environments

The SDK works in both the browser and Node environments. As a result, we provide multiple build targets for you to consume depending on your environment:

### Libraries

*   [**ESM**](https://unpkg.com/eventbrite/lib/esm/) - (EMCAScript modules) Everything transpiled to ES5 except for ES2015 `import`/`export` statements enabling [_tree shaking_](https://webpack.js.org/guides/tree-shaking/)
*   [**CJS**](https://unpkg.com/eventbrite/lib/cjs/) - (CommonJS) Standard format for most bundling systems including Node fully transpiled to ES5
*   [**UMD**](https://unpkg.com/eventbrite/lib/umd/) - (Universal module definition) Combination of EJS & AMD (asynchronous module definition) fully transpiled to ES5

### Bundled distributions

If you don't have or cannot use a module system in your web app, the bundle distributions come as a single file with all of the dependencies included:

*   [`eventbrite.min.js`](https://unpkg.com/eventbrite/dist/eventbrite.min.js) - Minified and fully transpiled `<script>` include
*   [`eventbrite.js`](https://unpkg.com/eventbrite/dist/eventbrite.js) - Unminified and fully transpiled `<script>` include

## Contributing

Contributions are welcome! See [Contributing Guidelines](CONTRIBUTING.md) for more details.

## Project philosophy

We take the stability of this SDK **very** seriously. `eventbrite` follows the [SemVer](http://semver.org/) standard for versioning.

All updates must pass the [CI build](https://travis-ci.org/eventbrite/eventbrite-sdk-javascript/).

## License

The library is available as open source under the terms of the [MIT License](LICENSE).
