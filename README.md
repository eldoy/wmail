# Wmail

Send email with mailgun.

### Installation
```
npm i wmail
```

### Usage
```javascript
const wmail = require('wmail')
const mail = wmail({
  domain: 'APIDOMAIN',
  key: 'APIKEY',
  config: {
    subject: 'Subject',
    reply: 'Name <hello@example.com>',
    from: 'Name <hello@example.com>',
    to: 'Name <hello@example.com>'
  },
  emails: {
    support: {
      function(data) {
        return {
          // Return message options here
          text: 'hello: ' + data.name,
          html: 'hello: ' + data.name
        }
      }
    }
  }
})

// Send email with options
const result = mail(
  {
    template: 'support',
    to: 'vidar@eldoy.com',
    subject: 'Hello',
    text: 'How are you?'
  },
  data
)

// On success
{
  id: '<20190910043104.1.043A7DC389CBE263@fugroup.net>',
  message: 'Queued. Thank you.'
}

// On error
{
  "id": undefined,
  "message": "'from' parameter is missing",
  "status": 400
}

// Message object looks like this:
{
  to: 'vidar@eldoy.com',
  from: 'vidar@fugroup.net',
  cc: 'cc@fugroup.net',
  bcc: 'bcc@fugroup.net',
  subject: 'hello',
  html: '<h1>Hello</h1>',
  text: 'Hello',
  reply: 'vidar@eldoy.com',
  attachment: [readStream],
  inline: [readStream]
}

```
MIT licensed. Enjoy!
