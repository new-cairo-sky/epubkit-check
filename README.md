# epubkit-check

This is a fork of https://github.com/bhdirect-ebooks/epub-check, modified to allow the checking of both epub archives and epub directories. Additionally, the epubcheck CLI command options are exposed in the api.

This will asynchronously validate an EPUB with Node ^7.6, using the most recent release of [epubcheck](https://github.com/IDPF/epubcheck), currently v4.2.2.

## Install

```
npm i -s https://github.com/new-cairo-sky/epubkit-check.git
```

## Usage

Require or import as `epubCheck`, then call `epubCheck('path/to/epub', [options])`.

```js
import epubkitCheck from "epubkit-check";

// check an expanded epub directory
const dirResults = epubkitCheck("path/to/epub-dir/");

// check an epub archive file:
const archiveResults = epubkitCheck("path/to/test.epub");
```

where options is an object composed of the epubcheck CLI options you wish to set. The purpose of each option is explained on the [epubcheck wiki](https://github.com/w3c/epubcheck/wiki/Running).

```
{
  profile: string
  mode: string
  version: string
  save: bool
  out: string
  xmp: string
  json: string
  quiet: bool,
  fatal: bool,
  error: bool,
  warn: bool,
  usage: bool ,
  listChecks: string,
  customMessages: string,
}
```

`epubCheck` then returns a Promise which resolves with an object that includes pass/fail data, and an array of error and warning messages, if any.

```
{ pass: true, messages: [] }
```

or

```
{ pass: false,
  messages: [{
    'type': '',  // epubcheck message type, e.g. 'ERROR(RSC-012)'
    'file': '',  // file path and name, relative to the given directory
    'line': '',  // line number
    'col': '',   // column number
    'msg': ''    // error or warning message, e.g. 'Fragment identifier is not defined.'
    }
  ]
}npm
```
