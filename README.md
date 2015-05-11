# Kontainer
A media file format generator/parser that exposes a React-like API.

![logo](logo.png)

Kontainer aims to fully support the MP4 (ISO Base Media file format: ISO/IEC 14496-12) and WebM file format.

## Install

```
$ npm install -g kontainer-js
```

## API

Each MP4 Box is represented as a KontainerElement which is similar to ReactElement.
(TODO: Support JSX.)

```js
    var Kontainer = require('kontainer-js'),
        IsoBmff = Kontainer.IsoBmff,
        element, buffer, string;

    // IsoBmff.createElement()
    //   Accepts: Box type, props, children...
    //   Returns: KontainerElement
    element = IsoBmff.createElement('file', null,
      IsoBmff.createElement('ftyp', {majorBrand: 'isom'}),
      IsoBmff.createElement('moov', null,
        IsoBmff.createElement('mvhd', {creationTime: new Date(0), modificationTime: new Date(0), timeScale: 1, nextTrackId: 4}),
        IsoBmff.createElement('trak', null,
          IsoBmff.createElement('tkhd', {creationTime: new Date(0), modificationTime: new Date(0), trackId: 1, width: 640, height: 480}),
          IsoBmff.createElement('mdia')
        )
      )
    );

    // Kontainer.renderToBuffer()
    //   Accepts: KontainerElement
    //   Returns: Buffer (in node) or ArrayBuffer (in browser) that contains a media stream
    buffer = Kontainer.renderToBuffer(element);

    // IsoBmff.createElementFromBuffer()
    //   Returns: Buffer (in node) or ArrayBuffer (in browser) that contains a media stream
    //   Returns: KontainerElement.
    element = IsoBmff.createElementFromBuffer(buffer);

    
    // Accepts a KontainerElement and returns a string that represetns the file structure.
    string = Kontainer.renderToString(element);
```

## CLI

A simple parser for displaying the structure of a media file.

```
Usage:
    kontainer filePath [options]

Example:
    kontainer /path/to/mediafile --mp4
Options:
  -h, --help    Print help
  -v, --version Print version
  --mp4         Indicating this file is ISO Base Media File
```

## Development

```
// Install
$ git clone git@github.com:kuu/Kontainer.git
$ cd Kontainer
$ npm install

// Test
$ npm test

// Build a client lib (uncompressed)
$ npm run build
// --> ./concatenated/kontainer.js

// Build a client lib (compressed)
$ npm run release-build
// --> ./minified/kontainer.js
// --> ./minified/kontainer.map.js
```
