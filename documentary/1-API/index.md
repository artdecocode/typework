## CLI

The package works via a CLI by passing the configuration file to it.

```
typework example/config.json
```

The config must include 3 properties:

%EXAMPLE: test/fixture/config.json%

- <kbd>🔖 entry</kbd> This is where the types are coming form. This can be a separate package, e.g., `@typedefs/goa`
- <kbd>🎯 js</kbd> The project source code into where to place the original types into.
- <kbd>📂 destination</kbd> Whenever the types import other files with `import('../types/')`, the target files will be copied to this folder.

Upon run, the types' JSDoc declarations are copied from the entry into the source _JS_ file, so that they become a native part of the project. All other files found under relative import paths, will be placed into the _Destination_ folder.

The example below demonstrates, how types written for the [_Goa_](https://github.com/idiocc/goa) package and published as [`@typedefs/goa`](https://npmjs.com/package/@typedefs/goa), were imported into the [_Goa/Koa_](https://github.com/idiocc/koa) project, so that they can be distributed without having to install `@typedefs/goa` from NPM as a production dependency. This is a strategy for distribution of JSDoc types.

<table>
<tr><td>
 <a href="https://github.com/idiocc/goa/blob/master/types/index.js">entry.js</a></td>

<td><md2html>
_Typework_ will read the entry files, to detect the `/* typework */` market which indicates a single block of types which can be managed by the binary (only types within this block will be worked on).
</md2html></td></tr>
<!-- block-start -->
<tr><td colspan="2">

%EXAMPLE: node_modules/@typedefs/goa%
</td></tr>
<tr><td>
 <a href="example/index2.js">index2.js</a>
</td><td><md2html>

The JS file where the types need to be placed, will also contain the `/* typework */` marker, but only a single one. It should be at the end and allow for 1 extra line at the end (a file cannot finish with `*/`, only `*/\n`).</md2html></td></tr>
<!-- /block-end -->
<!-- block-start -->
<tr><td colspan="2">

%EXAMPLE: example%

<details>
<summary><kbd>Show Typework</kbd></summary>

%EXAMPLE: example/index2%
</details>

</td></tr>
<tr><td>
 <a href="example/types">types</a>
</td><td><md2html>

The purpose of _Typework_ is to vendor JSDoc across packages easily, so that the IDE documentation can be shown without relying on additional infrastructure like _Typings_. One of downside of current JSDoc is the lack of import statements, therefore _Typework_ is meant to work in environments which support `import`.

</md2html></td></tr>
<!-- /block-end -->
<!-- block-start -->
<tr><td colspan="2">

%TREE example/types%
</td></tr>
<!-- /block-end -->
</table>

%~%