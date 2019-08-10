# Wmail

Send email with mailgun.

### Installation
```
npm i wmail
```

### Usage
Add a config.js file in your root directory:
```javascript
module.exports = {
  domain: 'fugroup.net',
  key: 'your-mailgun-key'
}
```

Then send a message:
```javascript
const wmail = require('wmail')

// File attachment needs to be a readStream
const fs = require('fs')
const fspath = require('path')
const filename = 'sirloin.png'
const filepath = fspath.join(__dirname, filename)
const file = fs.createReadStream(filepath)

const mail = {
  to: 'Vidar Eldøy <vidar@eldoy.com>',
  from: 'Fugroup <vidar@fugroup.net>',
  cc: 'cc@fugroup.net',
  bcc: 'bcc@fugroup.net',
  subject: 'hello',
  html: '<h1>Helloæøå</h1>',
  text: 'Helloæøå',
  reply: 'vidar@fugroup.net',
  attachment: [file]
}
const result = await wmail(mail)
```
MIT licensed. Enjoy!
