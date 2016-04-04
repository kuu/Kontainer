# Kontainer
A media file format generator/parser that exposes a React-like API. `kontainer-js` is available as an [npm package](https://www.npmjs.com/package/kontainer-js).

![logo](logo.png)

Kontainer aims to fully support the MP4 (ISO Base Media file format: ISO/IEC 14496-12) and WebM file format. The library can be used on Node.js and in the browser.

## Install

```
$ npm install -g kontainer-js
```

## API

A media file like MP4 and WebM is composed of nested objects. In Kontainer, each object, e.g. MP4 Box, is represented as a `KontainerElement` which is similar to the `ReactElement`.

The actual media data (audio and video chunks) and the metadata are represented as a `props` object and passed to the `KontainerElement` as its attributes.

```js
import Kontainer from 'kontainer-js';

const IsoBmff = Kontainer.IsoBmff;

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
        <mvhd creationTime={new Date()} modificationTime={new Date()} timeScale={1} nextTrackId={4} />
        <trak>
          <tkhd creationTime={new Date()} modificationTime={new Date()} trackId={1} width={this.width} height={this.height} />
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

The above code is transpiled into the calls to `createElement()` using [`babel`](https://babeljs.io/) and a dedicated [plugin](https://www.npmjs.com/package/babel-plugin-transform-kontainer-js).

```js
    // IsoBmff.createElement()
    //   Accepts: type, props, children...
    //   Returns: KontainerElement
    return IsoBmff.createElement('file', null,
      IsoBmff.createElement('ftyp', {majorBrand: 'isom'}),
      IsoBmff.createElement('moov', null,
        IsoBmff.createElement('mvhd', {creationTime: new Date(0), modificationTime: new Date(), timeScale: 1, nextTrackId: 4}),
        IsoBmff.createElement('trak', null,
          IsoBmff.createElement('tkhd', {creationTime: new Date(0), modificationTime: new Date(), trackId: 1, width: 640, height: 480}),
          IsoBmff.createElement('mdia', null,
            ...
            // KontainerElement can be a child of other elements to compose a large nested tree.
          )
        )
      )
    );
```

Once an element is obtained, it can be serialized into a byte stream using `renderToBuffer()`.

```js
    // Kontainer.renderToBuffer()
    //   Accepts: KontainerElement
    //   Returns: Buffer (in node) or ArrayBuffer (in browser) that contains a media stream
    buffer = Kontainer.renderToBuffer(element);
```

On the other hand, you can parse a byte stream and reproduce a KontainerElement from it.

```js
    // IsoBmff.createElementFromBuffer()
    //   Accepts: Buffer (in node) or ArrayBuffer (in browser) that contains a media stream [, offset=0]
    //   Returns: KontainerElement.
    element = IsoBmff.createElementFromBuffer(buffer, offset);

```

You can also create your hook and process a byte stream progressively.

```js
class MyBoxVisitor extends IsoBmff.BoxVisitor {
  enter(type, props) {
    // Implement this
  }
  exit(type, props) {
    // Implement this
  }
}

const transform = IsoBmff.transform(new MyBoxVisitor());

input.pipe(transform).pipe(process.stdout);
```

### JSX

To transpile JSX code into `createElement()` calls together with your ES6 code, you need to install `babel` and its plugins.

```
$ npm install babel-cli
$ npm install babel-preset-es2015
$ npm install babel-plugin-transform-kontainer-js
```

Put a .babelrc file in the source directories that contain JSX.

```js
{
  "presets": ["es2015"],
  "plugins": ["transform-kontainer-js"]
}
```

Then use the `babel` command to transpile the code.

```
$ babel src/ -d dist/
```

See the [plugin code](https://github.com/kuu/babel-plugin-transform-kontainer-js) for the details.


## CLI

A simple parser for displaying the structure of media file.

```
Usage:
    kontainer filePath [options]

Example:

    kontainer /path/to/file
Options:

  -h, --help    Print help
  -v, --version Print version
```

## Development

```
// Install
$ git clone git@github.com:kuu/Kontainer.git
$ cd Kontainer
$ npm install

// Test
$ npm test

// Build client libs
$ npm run build
// --> ./lib/kontainer.deb.js (uncompressed with debug messages)
// --> ./lib/kontainer.js (uncompressed)
// --> ./lib/kontainer.min.js (compressed)
// --> ./lib/kontainer.map.js (source map)
```
