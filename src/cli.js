import fs from 'fs';
import yargs from 'yargs';
import pkg from '../package.json';
import Kontainer from '.';


const argv = yargs.argv;

const HELP = `
Usage:
    kontainer filePath [options]

Example:
    kontainer /path/to/file
Options:
  -h, --help    Print help
  -v, --version Print version
`;

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


  const visitor = new Kontainer.IsoBmff.IsoBmffDumpVisitor();
  const logger = Kontainer.IsoBmff.transform(visitor);

  input.pipe(logger).pipe(process.stdout);

  input.on('error', () => {
    console.error('[kontainer] Unable to read - ' + filePath);
  });
}
