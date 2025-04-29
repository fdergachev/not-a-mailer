import { ProcessedRow, Row, RowRaw } from "../types/row";
import { formatRow } from "./rowFormater";

const fs = require('fs');
const { parse } = require('papaparse');
const stream = require('stream');

const Papa = {
  ...require('papaparse'),
  NODE_STREAM_INPUT: 1
};


export async function processCsvFile(filePath:string, delay = 0, processingFunction: (row:ProcessedRow, totalProcessed:number)=>{success:boolean, error?:Error}) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      reject(new Error(`File not found: ${filePath}`));
      return;
    }

    const stats = {
      totalProcessed: 0,
      successCount: 0,
      failCount: 0
    };

    // Create read stream
    const csvStream = fs.createReadStream(filePath, { encoding: 'utf8' });
    
    // Set up Papa Parse to stream the CSV
    const parseStream = parse(Papa.NODE_STREAM_INPUT, {
      header: true,         // Treat first row as headers
      skipEmptyLines: true, // Skip empty lines
      dynamicTyping: true,  // Convert strings to numbers/booleans when possible
    });
    
    // Create processing pipeline
    const processor = new stream.Transform({
      objectMode: true,
      async transform(row:RowRaw, encoding:string, callback:any) {
        stats.totalProcessed++;
        
        // Process the current row
      const rowProcessed = formatRow(row);
        const result = await processingFunction(rowProcessed, stats.totalProcessed);
        
        // Update stats
        if (result.success) {
          stats.successCount++;
        } else {
          stats.failCount++;
        }
        
        // Add delay between emails
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Pass the row downstream (not really needed in this case)
        callback(null, row);
      }
    });
    
    // Set up the pipeline
    csvStream
      .pipe(parseStream)
      .pipe(processor)
      .on('data', () => {
        // We don't need to do anything with the data
      })
      .on('error', (error:Error) => {
        console.error('Pipeline error:', error);
        reject(error);
      })
      .on('end', () => {
         console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
         console.log(`📊 Email Sending Summary:`);
         console.log(`✅ Successful: ${stats.successCount}`);
         console.log(`❌ Failed: ${stats.failCount}`);
         console.log(`📧 Total processed: ${stats.totalProcessed}`);
         console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
         resolve(stats);
       });
  });
}

