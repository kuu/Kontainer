'use strict';

(function () {

  var fs = require('fs'),
      yargs = require('yargs'),
      pkg = require('../../package.json'),
      Kontainer = require('./index.js');

  var filePath,
      element,
      argv = yargs.boolean(['mp4']).argv,
      printHelp = function printHelp() {
    var message = 'Usage:\n';
    message += '    kontainer filePath [options]\n\n';
    message += 'Example:\n';
    message += '    kontainer /path/to/file --mp4\n';
    message += 'Options:\n';
    message += '  -h, --help    Print help\n';
    message += '  -v, --version Print version\n';
    message += '  --mp4         Indicating this file is ISO Base Media File\n';
    console.info(message);
  },
      printVersion = function printVersion() {
    var message = 'v';
    message += pkg.version;
    console.info(message);
  };

  if (argv.h || argv.help) {
    printHelp();
    return;
  }

  if (argv.v || argv.version) {
    printVersion();
    return;
  }

  filePath = argv._[0];

  if (!filePath) {
    printHelp();
    return;
  }

  fs.readFile(filePath, function (err, buffer) {
    if (err) {
      console.error('[kontainer] Unable to open - ' + filePath);
      return;
    }

    element = Kontainer.IsoBmff.createElementFromBuffer(buffer);

    if (!element) {
      console.error('[kontainer] Unsupported format.');
    } else {
      console.log(Kontainer.renderToString(element));
    }
  });
})();