import { readConfig, RowProcessor } from "./modules/mailer";

const {processCsvFile} = require("./modules/fileProcessor")

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const path = require('path');

const asciiArt = `
  _   _       _        _    __  __       _ _           
 | \\ | |     | |      / \\  |  \\/  |     (_) |          
 |  \\| | ___ | |_    / _ \\ | \\  / | __ _ _| | ___ _ __ 
 | . \` |/ _ \\| __|  / ___ \\| |\\/| |/ _\` | | |/ _ \\ '__|
 | |\\  | (_) | |_  / /   \\ \\ |  | | (_| | | |  __/ |   
 |_| \\_|\\___/ \\__|/_/     \\_\\_|  |_|\\__,_|_|_|\\___|_|   
                                                        
 CSV Email Sender - Definitely Not A Mass Mailer
`;

console.log(asciiArt);

const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 [csv_file] [config_file] [options]')
  .example('$0 recipients.csv config.json', 'Run with positional arguments')
  .example('$0 -f recipients.csv -c config.json', 'Run with explicit flags')
  .option('file', {
    alias: 'f',
    description: 'Path to CSV file containing recipient data',
    type: 'string'
  })
  .option('config', {
    alias: 'c',
    description: 'Path to JSON config file with sender, subject, and body',
    type: 'string'
  })
  .help()
  .alias('help', 'h')
  .version()
  .epilogue('For more information, check the README.md')
  .wrap(100)
  .argv;

// Handle both positional arguments and flags
let csvFilePath:string, configFilePath:string;

if (argv._.length >= 2) {
  // When using positional arguments: node mailer.js recipients.csv config.json
  csvFilePath = argv._[0];
  configFilePath = argv._[1];
} else {
  // When using flags: node mailer.js -f recipients.csv -c config.json
  csvFilePath = argv.file;
  configFilePath = argv.config;
}

// Validate that we have the required paths
if (!csvFilePath || !configFilePath) {
  console.error('Error: Missing required CSV file or config file path');
  console.log('Run with --help for usage information');
  process.exit(1);
}

// const csvFilePath = process.argv[2] || 'emails.csv';

async function main() {
  try {
    const csvFileAbsolutePath = path.join(__dirname, "..\\"+csvFilePath); 
    const configFileAbsolutePath = path.join(__dirname, "..\\"+configFilePath); 
    console.log('Starting to stream CSV file and send emails...');
    const rowProcessor =new RowProcessor(readConfig(configFileAbsolutePath )) 
    await processCsvFile(csvFileAbsolutePath , 0, rowProcessor); 
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}


main();

