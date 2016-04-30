import fs from 'fs';
import yargs from 'yargs';
import Kontainer from '.';

const argv = yargs.boolean(['mp4', 'webm']).argv;
const HELP = `
Usage:
    kontainer filePath [options]

Example:
    kontainer /path/to/file
    kontainer --webm /path/to/file

Options:
  -h, --help    Print help
  -v, --version Print version
  --mp4         The file is MP4 (default)
  --webm        The file is WebM
`;

let pkg;

try {
  pkg = require('./package.json');
} catch (e) {
  // Being executed locally
  pkg = require('../package.json');
}

const VERSION = `v${pkg.version}`;
const filePath = argv._[0];

if (argv.h || argv.help) {
  console.info(HELP);
} else if (argv.v || argv.version) {
  console.info(VERSION);
} else if (!filePath) {
  console.info(HELP);
} else {

  let input;

  if (filePath === process.stdin) {
    input = filePath;
  } else {
    input = fs.createReadStream(filePath);
  }

  if (argv.webm) {
    Kontainer.use('webm');
  } else {
    Kontainer.use('mp4');
  }

  const visitor = new Kontainer.DumpVisitor();
  const logger = Kontainer.transform(visitor);

  input.pipe(logger).pipe(process.stdout);

  input.on('error', () => {
    console.error('[kontainer] Unable to read - ' + filePath);
  });
}
