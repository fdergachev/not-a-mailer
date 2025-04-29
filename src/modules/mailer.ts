import { ProcessRowConfig } from "../types/config";
import { ProcessedRow } from "../types/row";
require('dotenv').config()
const nodemailer = require('nodemailer');
const fs = require('fs');

const smtpConfig = {
  host: process.env.SMTP_SERVER,
  port: process.env.SMTP_PORT, 
  secure: false,           
  auth: {
    user: process.env.SMTP_LOGIN,  
    pass: process.env.SMTP_PASSWORD 
  }
};

export const transporter = nodemailer.createTransport(smtpConfig);

export class RowProcessor {
   _config: ProcessRowConfig;

   constructor (config: ProcessRowConfig){
      this._config = config
   }

   public async processRow(row: ProcessedRow,  rowIndex:number) {
      if (!row.email || !row.email.includes('@')) {
         console.log(`Row ${rowIndex}: Invalid or missing email address, skipping`);
         return { success: false, error: 'Invalid email' };
      }

      const mailOptions = {
         ...this._config,
         to: row.email
      };

      if (row.subject) {
         mailOptions.subject = row.subject;
      }

      if (row.body) {
         mailOptions.html = row.body;
      }

      try {
         await transporter.sendMail(mailOptions, (error:Error , info:any) => {
            if (error) {
               throw error
            }
         console.log(`📨 Email sent to ${row.email} with ID ${info.messageId} (${rowIndex})`);
          });
         return { success: true };
      } catch (error:any) {
         console.error(`❌ Failed to send email to ${row.email}: ${error.message}`);
         return { success: false, error: error.message };
      }
}

}



export function readConfig(filePath:string) {
  try {
    const configData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(configData);
  } catch (error: any) {
    console.error(`Error reading config file: ${error.message}`);
    process.exit(1);
  }
} 

