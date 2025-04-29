import { ProcessedRow } from "../types/row";
require('dotenv').config()
const nodemailer = require('nodemailer');

const smtpConfig = {
  host: process.env.SMTP_SERVER,
  port: process.env.SMTP_PORT, 
  secure: false,           
  auth: {
    user: process.env.SMTP_LOGIN,  
    pass: process.env.SMTP_PASSWORD 
  }
};

const emailDefaults = {
   //"Dragana Božović (via Univerza v Mariboru)" <estudij@noreply.um.si>
  from: '"Dragana Božović (via Univerza v Mariboru)" <estudij.noreply@gmail.com>',
  subject: 'MATEMATIČNA ANALIZA (27343): Vaje za študijsko smer RIT UN dne 8. 5. 2025',
  html: 
  `
<html><head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
</head>
<body>
<p></p>
<div style="background-color:#FFEB9C; width:100%; border-style: solid; border-color:#9C6500; 
border-width:1pt; padding:2pt; font-size:10pt; line-height:12pt; 
font-family:'Calibri'; color:Black; text-align: left;">
<span style="color:#9C6500" ;font-weight:bold;="">POZOR:</span> To je sistemski elektronski naslov. Vaše sporočilo ne bo dostavljeno. | This is a system email address. Your message will not be delivered.</div>
<br>
<p></p>
<div>
<div class="navbar"><a target="_blank" href="https://estudij.um.si/course/view.php?id=20962">MATEMATIČNA ANALIZA (27343)</a> »
<a target="_blank" href="https://estudij.um.si/mod/forum/index.php?id=20962">Forumi</a> »
<a target="_blank" href="https://estudij.um.si/mod/forum/view.php?f=11349">Forum novic</a> »
<a target="_blank" href="https://estudij.um.si/mod/forum/discuss.php?d=132133">Vaje za študijsko smer RIT UN dne 8. 5. 2025</a>
</div>
<table border="0" cellpadding="3" cellspacing="0" class="forumpost">
<tbody>
<tr class="header">
<td width="35" valign="top" class="picture left"><a href="https://estudij.um.si/user/view.php?id=55218&amp;course=20962" class="d-inline-block aabtn"><span class="userinitials size-35">DB</span></a>
</td>
<td class="topic starter">
<div class="subject">Vaje za študijsko smer RIT UN dne 8. 5. 2025 </div>
<div class="author">od <a target="_blank" href="https://estudij.um.si/user/view.php?id=55218&amp;course=20962">
Dragana Božović</a> - četrtek, 24. april 2025, 09.44 </div>
</td>
</tr>
<tr>
<td class="left side" valign="top">&nbsp; </td>
<td class="content">
<p dir="ltr" style="text-align:left;">Pozdravljeni,</p>
<p dir="ltr" style="text-align:left;">v četrtek, <strong>dne 8. 5. 2025</strong>, bomo imeli še zadnje vaje pri predmetu Matematična analiza za študijsko smer RIT UN.<br>
Z vajami 1. skupine bomo pričeli ob <strong>8.15</strong> (namesto ob 7.30).<br>
Z vajami 2. skupine bomo pričeli (kot ponavadi) ob <strong>10.15</strong>.<br>
<br>
Lepe počitnice,<br>
Dragana</p>
<div class="commands"></div>
<div class="link"><a target="_blank" href="https://estudij.um.si/mod/forum/discuss.php?d=132133#p190924">Oglej si objavo v kontekstu
</a></div>
</td>
</tr>
</tbody>
</table>
<hr>
<div class="mdl-align unsubscribelink"><a href="https://estudij.um.si/mod/forum/index.php?id=20962">Spremenite nastavitve izvlečkov foruma</a>
</div>
</div>
</body>
</html>
  `
};

export const transporter = nodemailer.createTransport(smtpConfig);

export async function processRow(row: ProcessedRow,  rowIndex:number) {
  // Skip rows without email addresses
  if (!row.email || !row.email.includes('@')) {
    console.log(`Row ${rowIndex}: Invalid or missing email address, skipping`);
    return { success: false, error: 'Invalid email' };
  }
  
  // Prepare email options
  const mailOptions = {
    ...emailDefaults,
    to: row.email
  };
  
  // Customize subject if available in CSV
  if (row.subject) {
    mailOptions.subject = row.subject;
  }
  
  // Customize body if available in CSV
  if (row.body) {
    mailOptions.html = row.body;
  }
  
  // Add custom field replacements (personalization)
//   if (mailOptions.html) {
//     Object.keys(row).forEach((key:) => {
//       const placeholder = new RegExp(`{{${key}}}`, 'g');
//       mailOptions.html = mailOptions.html.replace(placeholder, row[key] || '');
//     });
//   }
  
  try {
   // Send email
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