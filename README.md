# Wmail
Send emails with Mailgun

### Installation
```
npm i wmail
```

### Usage
```javascript
// Set up route object, can be loaded from disk
const $ = {
  app: {
    mail: {
      layouts: {
        html: async function ($, data) {},
        txt: async function ($, data) {
          return `<div class="content">${ $.mail.html.content }</div>`
        }
      }
      contact: async function ($, data) {
        return {
          options: {
            subject: 'contact'
          },
          html: {
            layout: 'html',
            content: `<div>content</div>`
          },
          text: {
            layout: 'text',
            content: `content`
          }
        }
      }
    }
  }
}

// Default options
const defaultOptions = {
  subject: 'Contact',
  reply: 'hello@example.com',
  from: 'hello@example.com',
  to: 'hello@example.com'
}

// Mailgun credentials
const credentials = {
  domain: 'example.com',
  key: 'your-mailgun-key'
}

// Create mailer
const mailer = wmail({...credentials, defaultOptions })

// Send email
const options = {
  to: 'Vidar Eldøy <vidar@eldoy.com>',
  attachment: [file]
}

// Parameters: name, options, route, data
const result = await mailer('mail1', options, $, { key: 'hello' })

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
