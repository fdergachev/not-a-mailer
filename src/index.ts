import { processRow } from "./modules/mailer";

const {processCsvFile} = require("./modules/fileProcessor")

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

// Display the ASCII art banner
console.log(asciiArt);

// Get file path from command line argument
const csvFilePath = process.argv[2] || 'emails.csv';

// SMTP Configuration - Replace with your actual SMTP details

// Email configuration - Customize as needed

// Function to stream CSV file and process each row
// Main function to execute the script
async function main() {
  try {
    // File path - update with your actual CSV file path
    const csvFileAbsolutePath = path.join(__dirname, "..\\"+csvFilePath); 
    console.log('Starting to stream CSV file and send emails...');
    
    // Stream CSV and send emails with delay to avoid rate limiting
    await processCsvFile(csvFileAbsolutePath , 0, processRow); // 2 second delay between emails
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

// Allow PapaParse to be used with Node.js streams
// Run the script
main();

/*
Expected CSV format example:
email,name,subject,body
user1@example.com,John,Hello John,<p>Hi {{name}}, this is your personalized message!</p>
user2@example.com,Jane,Hello Jane,<p>Hi {{name}}, this message is for you!</p>
*/