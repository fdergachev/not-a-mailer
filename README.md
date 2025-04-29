## That's definitely not a mailer :)
![Снимок экрана 2025-04-29 1634162](https://github.com/user-attachments/assets/bac700ee-e10f-40e0-8b41-54efcd39d00d)

## Set up guide
1. Install dependencies `npm i`
2. Add your SMTP creds into `.env`
```js
SMTP_LOGIN=*login*
SMTP_PASSWORD=*password*
SMTP_PORT=*port*
SMTP_SERVER=*server*
```
3. Change sender and email template in your `mailer.ts`
4. To run the application simply use `npm start /path/to/csv`
5. Enjoy!😎

P.S. Hope you don't mind leaving a ⭐
