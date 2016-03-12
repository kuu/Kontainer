# Kontainer
A media file format generator/parser that exposes a React-like API.

![logo](logo.png)

Kontainer aims to fully support the MP4 (ISO Base Media file format: ISO/IEC 14496-12) and WebM file format.

## Install

```
$ npm install -g kontainer-js
```

## API

A media file like MP4 or WebM is composed of nested objects. In Kontainer, each object, e.g. MP4 Box, is represented as a KontainerElement which is similar to ReactElement.

The actual media data (audio and video chunks) and metadata are represented as a `props` object and need to be passed to `createElement()`.

```js
    var Kontainer = require('kontainer-js'),
        IsoBmff = Kontainer.IsoBmff,
        element, buffer, string;

    // IsoBmff.createElement()
    //   Accepts: type, props, children...
    //   Returns: KontainerElement
    element = IsoBmff.createElement('file', null,
      IsoBmff.createElement('ftyp', {majorBrand: 'isom'}),
      IsoBmff.createElement('moov', null,
        IsoBmff.createElement('mvhd', {creationTime: new Date(0), modificationTime: new Date(0), timeScale: 1, nextTrackId: 4}),
        IsoBmff.createElement('trak', null,
          IsoBmff.createElement('tkhd', {creationTime: new Date(0), modificationTime: new Date(0), trackId: 1, width: 640, height: 480}),
          IsoBmff.createElement('mdia', null,
            ...
            // KontainerElement can be a child of other elements to compose a large nested tree.
          )
        )
      )
    );
```

Once an element is created, it can be serialized into a byte stream using `renderToBuffer()`.

```js
    // Kontainer.renderToBuffer()
    //   Accepts: KontainerElement
    //   Returns: Buffer (in node) or ArrayBuffer (in browser) that contains a media stream
    buffer = Kontainer.renderToBuffer(element);
```

Similarly, you can parse a byte stream and reproduce a KontainerElement from it.

```js
    // IsoBmff.createElementFromBuffer()
    //   Accepts: Buffer (in node) or ArrayBuffer (in browser) that contains a media stream [, offset=0]
    //   Returns: KontainerElement.
    element = IsoBmff.createElementFromBuffer(buffer, offset);

```

And then you can convert the element tree into a text using `renderToString()`.

```js
    // Kontainer.renderToString();
    //   Accepts: KontainerElement[, Formatter]
    //   Returns: A string that represetns the structure of media file.
    string = Kontainer.renderToString(element, formatter);
```

The `formatter` is an optional and when specified, it needs to be an object with three functions that will be repeatedly called during the tree traversal.
If you don't specify the `formatter` object, the default one will be used.

```js
    // The formatter needs to be an object with the following functions.
    // (the first param is always the depth in the tree.)
    {
      header: (depth, typeName) => {
        // Called when a certain type of object is found.
      },
      footer: (depth, typeName) => {
        // Called when the processing of the object is completed.
      },
      body: (depth, key, value) => {
        // Called for each key-value pair in the object's props.
      }
    }
```

### JSX

You can also use JSX to composite KontainerElements.

#### src/MP4.js
```
import {IsoBmff} from 'kontainer-js';

export default class MP4 {

  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  render() {
    return (
    <file>
      <ftyp majorBrand="isom" />
      <moov>
        <mvhd creationTime={new Date(0)} modificationTime={new Date(0)} timeScale={1} nextTrackId={4} />
        <trak>
          <tkhd creationTime={new Date(0)} modificationTime={new Date(0)} trackId={1} width={this.width} height={this.height} />
          <mdia>
            ...
          </mdia>
        </trak>
      </moov>
    </file>
    );
  }
}
```

The above example is witten in ES2015 + JSX.
Use `babel` to do this.

```
$ npm install babel-cli
$ npm install babel-preset-es2015
$ npm install babel-plugin-transform-kontainer-js
```

And then put a .babelrc file in your project dir.

```
{
  "presets": ["es2015"],
  "plugins": ["transform-kontainer-js"]
}
```

So that you can transpile the above file into ES5.

```
$ babel src/ -d dist/
```

See the [plugin code](https://github.com/kuu/babel-plugin-transform-kontainer-js) for the detail.


## CLI

A simple parser for displaying the structure of media file.

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
