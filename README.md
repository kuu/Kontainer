# Kontainer
A media file format generator/parser that exposes a React-like API.

![logo](logo.png)

Kontainer aims to fully support the MP4 (ISO Base Media file format: ISO/IEC 14496-12) and WebM file format.

## Install

```
npm install -g kontainer
```

## API

Each MP4 Box is represented as a KontainerElement which is similar to ReactElement.

```js
    var Kontainer = require('kontainer'),
        IsoBmff = Kontainer.IsoBmff,
        buffer, element, string;

    // Kontainer.renderToBuffer()
    // Accepts a KontainerElement and returns a Buffer (in node) or ArrayBuffer (in browser.)
    // Each element accepts a 'props' object that holds parameters.
    //
    buffer = Kontainer.renderToBuffer(
      IsoBmff.createElement('file', null,
        IsoBmff.createElement('ftyp', {majorBrand: 'isom'}),
        IsoBmff.createElement('moov', null,
          IsoBmff.createElement('mvhd', {creationTime: new Date(0), modificationTime: new Date(0), timeScale: 1, nextTrackId: 4}),
          IsoBmff.createElement('trak', null,
            IsoBmff.createElement('tkhd', {creationTime: new Date(0), modificationTime: new Date(0), trackId: 1, width: 640, height: 480}),
            IsoBmff.createElement('mdia')
          )
        )
      )
    );

    // Accepts a Buffer or ArrayBuffer and returns a KontainerElement.
    element = IsoBmff.createElementFromBuffer(buffer);

    
    // Accepts a KontainerElement and returns a string that represetns the file structure.
    string = Kontainer.renderToString(element);
```

## CLI

A simple parser for displaying the file structure.

```
Usage:
    kontainer filePath [options]

Example:
    kontainer /path/to/file --mp4
Options:
  -h, --help    Print help
  -v, --version Print version
  --mp4         Indicating this file is ISO Base Media File
```
