# epub-check

This is a fork of https://github.com/bhdirect-ebooks/epub-check, modified to allow the checking of both epub archives and epub directories. Additionally, the epubcheck cli command options are exposed in the api.

This will Asynchronously validate an EPUB with Node ^7.6, using the most recent release of [epubcheck](https://github.com/IDPF/epubcheck), currently v4.2.2.

## Install

```
npm i -s @bhdirect/epub-check
```

## Usage

Require or import as `epubCheck`, then call `epubCheck('path/to/expanded/epub/directory')`.

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
