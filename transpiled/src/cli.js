'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _package = require('../../package.json');

var _package2 = _interopRequireDefault(_package);

var _ = require('.');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var argv = _yargs2.default.argv;

var HELP = '\nUsage:\n    kontainer filePath [options]\n\nExample:\n    kontainer /path/to/file\nOptions:\n  -h, --help    Print help\n  -v, --version Print version\n';

var VERSION = 'v' + _package2.default.version;
var filePath = argv._[0];

if (argv.h || argv.help) {
  console.info(HELP);
} else if (argv.v || argv.version) {
  console.info(VERSION);
} else if (!filePath) {
  console.info(HELP);
} else {
  var input = undefined;

  if (filePath === process.stdin) {
    input = filePath;
  } else {
    input = _fs2.default.createReadStream(filePath);
  }

  var visitor = new _2.default.IsoBmff.IsoBmffDumpVisitor();
  var logger = _2.default.IsoBmff.transform(visitor);

  input.pipe(logger).pipe(process.stdout);

  input.on('error', function () {
    console.error('[kontainer] Unable to read - ' + filePath);
  });
}