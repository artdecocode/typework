# typework

[![npm version](https://badge.fury.io/js/typework.svg)](https://npmjs.org/package/typework)

_Typework_ is used to Manage And Vendor JSDoc Types. With the special `/* typework */` keyword, JSDoc type declarations can be moved across JS files, and imported files in types (`import('../types/context')`) will be copied across to the target project.

```sh
yarn add typework
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [CLI](#cli)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/0.svg?sanitize=true"></a></p>

## CLI

The package works via a CLI by passing the configuration file to it.

```
typework example/config.json
```

The config must include 3 properties:

```json
{
  "entry": "@typedefs/goa",
  "js": "compile/index.js",
  "destination": "types"
}
```

- <kbd>🔖 entry</kbd> This is where the types are coming form. This can be a separate package, e.g., `@typedefs/goa`
- <kbd>🎯 js</kbd> The project source code into where to place the original types into.
- <kbd>📂 destination</kbd> Whenever the types import other files with `import('../types/')`, the target files will be copied to this folder.

Upon run, the types' JSDoc declarations are copied from the entry into the source _JS_ file, so that they become a native part of the project. All other files found under relative import paths, will be placed into the _Destination_ folder.

The example below demonstrates, how types written for the [_Goa_](https://github.com/idiocc/goa/blob/master/types) package and published as [`@typedefs/goa`](https://npmjs.com/package/@typedefs/goa), were imported into the [_Goa/Koa_](https://github.com/idiocc/koa) project, so that they can be distributed without having to install `@typedefs/goa` from NPM as a production dependency. This is a strategy for distribution of JSDoc types.

<table>
<tr><td>
 <a href="https://github.com/idiocc/goa/blob/master/types/index.js">entry.js</a></td>

<td><em>Typework</em> will read the entry files, to detect the <code>/* typework */</code> market which indicates a single block of types which can be managed by the binary (only types within this block will be worked on).</td></tr>
<tr><td colspan="2">

```js
export {}

/* typework */
/**
 * @typedef {import('./vendor/cookies').Keygrip} Keygrip
 * @typedef {import('./typedefs/application').Middleware} Middleware
 * @typedef {import('./typedefs/application').Application} Application
 * @typedef {import('./typedefs/context').KoaContext} Context
 * @typedef {import('./typedefs/request').Request} Request
 * @typedef {import('./typedefs/request').ContextDelegatedRequest} ContextDelegatedRequest
 * @typedef {import('./typedefs/response').Response} Response
 * @typedef {import('./typedefs/response').ContextDelegatedResponse} ContextDelegatedResponse
 */
```
</td></tr>
<tr><td>
 <a href="example/index2.js">index2.js</a>
</td><td>The JS file where the types need to be placed, will also contain the <code>/* typework */</code> marker, but only a single one. It should be at the end and allow for 1 extra line at the end (a file cannot finish with <code>*/</code>, only <code>*/\n</code>).</td></tr>
<tr><td colspan="2">

```js
const _Koa = require('./koa')

class Koa extends _Koa {
  /**
   * Initialize a new `Application`.
   */
  constructor() {
    super()
  }
}

module.exports = Koa
```

<details>
<summary><kbd>Show Typework</kbd></summary>

```js
/* typework */
/**
 * @typedef {import('types/vendor/cookies').Keygrip} Keygrip
 * @typedef {import('types/typedefs/application').Middleware} Middleware
 * @typedef {import('types/typedefs/application').Application} Application
 * @typedef {import('types/typedefs/context').KoaContext} Context
 * @typedef {import('types/typedefs/request').Request} Request
 * @typedef {import('types/typedefs/request').ContextDelegatedRequest} ContextDelegatedRequest
 * @typedef {import('types/typedefs/response').Response} Response
 * @typedef {import('types/typedefs/response').ContextDelegatedResponse} ContextDelegatedResponse
 */
```
</details>

</td></tr>
<tr><td>
 <a href="example/types">types</a>
</td><td>The purpose of <em>Typework</em> is to vendor JSDoc across packages easily, so that the IDE documentation can be shown without relying on additional infrastructure like <em>Typings</em>. One of downside of current JSDoc is the lack of import statements, therefore <em>Typework</em> is meant to work in environments which support <code>import</code>.</td></tr>
<tr><td colspan="2">

```m
example/types
├── typedefs
│   ├── application.js
│   ├── context.js
│   ├── request.js
│   └── response.js
└── vendor
    ├── accepts.js
    └── cookies.js
```
</td></tr>
</table>

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/1.svg?sanitize=true"></a></p>

## Copyright

(c) [Art Deco][1] 2019

[1]: https://artd.eco

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/-1.svg?sanitize=true"></a></p>