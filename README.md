![image](https://github.com/user-attachments/assets/10f6dfa4-9548-4a21-902f-61210f92183c)## That's definitely not a mailer :)
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
3. Create your `config.json` in root folder with following structure:
```json
{
   "from": "\"*sender name*\" <*sender e-mail*>",
   "subject": "*subject*",
   "html": "*body html*"
}
```
make sure to escape JSON and minify HTML
4. To run the application simply use `npm start /path/to/csv config.json`
5. Enjoy!😎

## More info could be found by running `npm start -- --help`

P.S. Hope you don't mind leaving a ⭐
